import * as AWS from 'aws-sdk';
import * as csv from 'csv-parser';
import { BUCKET_NAME, AWS_REGION } from '../constants';

const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;

export const importFileParser = event => {
    console.log("importFileParser Lambda started execution");

    const s3 = new AWS.S3({ region: AWS_REGION});
    const sqs = new AWS.SQS();

    event.Records.forEach(record => {
        const objectKey = record.s3.object.key;
        const s3Stream = s3.getObject({
            Bucket: BUCKET_NAME,
            Key: objectKey
        }).createReadStream();

        s3Stream.pipe(csv())
            .on('data', data => {
                try{
                    sqs.sendMessage({
                        QueueUrl: SQS_QUEUE_URL,
                        MessageBody: JSON.stringify(data),
                    }, () => {
                        console.log('Sent ', data)
                    });
                }catch (e) {
                    console.log('Fail', e)
                }
            })
            .on('end', async () => {
                const newObjectKey = objectKey.replace('uploaded', 'parsed');
                await s3.copyObject({
                    Bucket: BUCKET_NAME,
                    CopySource: `${BUCKET_NAME}/${objectKey}`,
                    Key: newObjectKey
                }).promise();

                await s3.deleteObject({
                    Bucket: BUCKET_NAME,
                    Key: objectKey,
                }).promise();

                console.log(`Copied into ${BUCKET_NAME}/${newObjectKey}`);
                console.log(`Deleted from ${BUCKET_NAME}/uploaded`);
            })
    });
    return {
        headers: { 'Access-Control-Allow-Origin': '*' },
        statusCode: 202
    }
}
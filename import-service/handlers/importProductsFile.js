import { S3 }  from 'aws-sdk';
import { BUCKET_NAME,  AWS_REGION} from '../constants';

export const importProductsFile = async (event) => {
    console.log('Lambda function has been invoked with event:', JSON.stringify(event));

    const { queryStringParameters : { name } = {} }= event;
    const path = `uploaded/${name}`;
    const s3 = new S3({ region: AWS_REGION});
    const params = {
        Bucket: BUCKET_NAME,
        Key: path,
        ContentType: 'text/csv'
    };

    return new Promise((resolve, reject) => {
        s3.getSignedUrl('putObject', params, (error, url) => {
            if (error) {
                reject(error);
                return;
            }
            resolve({
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: url
            });
        });
    });
};
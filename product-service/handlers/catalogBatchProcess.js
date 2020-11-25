import { SNS } from 'aws-sdk';
import { createProduct } from '../utils/addProduct';

export const catalogBatchProcess = async (event) => {
    console.log('Lambda function has been invoked with event:', event.Records);

    const tasks = event.Records.map(async ({ body }) => {
        try {
            const product = body ? JSON.parse(body) : {};
            const { id, statusCode, error } = await createProduct(product);
            if (error) {
                console.log(`Product wasn't created`, error);
                return { statusCode, error}
            }
            console.log(`Product was created ${id}`);
            return { id, statusCode };
        } catch (error) {
            console.log(`Product wasn't created`, error);
            return { statusCode: '500', error };
        }
    });
    const result = await Promise.all(tasks);

    const sns = new SNS({ region: process.env.REGION });
    const topicArn = process.env.SNS_ARN;

    const status = result.find((i) => i.error) ? "fail" : "imported";
    const subject = result.find((i) => i.error) ? "Products aren't imported" : "Products are imported";

    await sns.publish({
        Subject: subject,
        Message: `${JSON.stringify(result, null, 2)}`,
        TopicArn: topicArn,
        MessageAttributes: {
            status: {
                DataType: "String",
                StringValue: status,
            },
        },
    }).promise();

};
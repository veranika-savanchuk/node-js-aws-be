import { Client } from 'pg';
import validate from 'uuid-validate';
import { selectProductById } from '../sql/query';
import { HEADERS, DB_OPTIONS } from "../constants";


export const getProductById = async (event) => {
    console.log('Lambda function has been invoked with event:', JSON.stringify(event, null, 2));

    const client = new Client(DB_OPTIONS);
    await client.connect();

    try {
        const  { pathParameters: { productId = '' } = {} } = event;
        const isValidUUID = validate(productId);

        if (!isValidUUID) {
            return {
                statusCode: 400,
                headers: HEADERS,
                body: JSON.stringify({error: 'Incorrect uuid'})
            };
        }

        const res = await client.query(selectProductById, [productId]);

        const { rows } = res;

        const productInfo = rows.find(i => i.id === productId);

        if(!productInfo) {
            return {
                statusCode: 404,
                headers: HEADERS,
                body: JSON.stringify({error: 'Not found'})
            };
        }

        return {
            statusCode: 200,
            headers: HEADERS,
            body: JSON.stringify(productInfo)
        };
    }catch (e) {
        return {
            statusCode: 500,
            headers: HEADERS,
            body: JSON.stringify({error: 'Internal Server Error'})
        };
    } finally {
        client.end();
    }
};


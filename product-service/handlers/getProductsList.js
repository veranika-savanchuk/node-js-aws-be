import { Client } from 'pg';
import { selectAllProducts } from '../sql/query';
import { HEADERS, DB_OPTIONS } from "../constants";

export const getProductsList = async (event) => {
    console.log('Lambda function has been invoked with event:', JSON.stringify(event, null, 2));

    const client = new Client(DB_OPTIONS);
    await client.connect();

    try {
        const res = await client.query(selectAllProducts);

        const { rows } = res;

        return {
            statusCode: res.status,
            headers: HEADERS,
            body: JSON.stringify(rows),
        };

    } catch (e) {
        return {
            statusCode: 500,
            headers: HEADERS,
            body: JSON.stringify({error: 'Internal Server Error'})
        }
    } finally {
        client.end();
    }
};
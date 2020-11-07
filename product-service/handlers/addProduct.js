import { Client } from 'pg';
import { insertToProductTable, insertToStocksTable } from '../sql/query';
import { validateProduct } from '../utils/validations';
import { HEADERS, DB_OPTIONS } from "../constants";

export const addProduct = async (event) => {
    console.log('Lambda function has been invoked with event:', JSON.stringify(event));

    const { body = null } = event || {};
    const product = body ? JSON.parse(body) : {};
    const { title = '', description = '', price = null, count = null } = product;

    const client = new Client(DB_OPTIONS);
    await client.connect();

    try {
        const isValid = await validateProduct({ title, description, price, count });
        if (!isValid) return {
            statusCode: 400,
            headers: HEADERS,
            body: JSON.stringify({error: 'BAD REQUEST'})
        };
        await client.query('BEGIN');

        const { rows: [{ id }] } = await client.query(insertToProductTable,[title, description, price]);
        await client.query(insertToStocksTable, [id, count]);
        await client.query('COMMIT');

        return {
            statusCode: 200,
            headers: HEADERS,
            body: JSON.stringify({ id }),
        };

    } catch (e) {
        await client.query('ROLLBACK');
        return {
            statusCode: 500,
            headers: HEADERS,
            body: JSON.stringify({error: 'Internal Server Error'})
        }
    } finally {
        client.end();
    }
};
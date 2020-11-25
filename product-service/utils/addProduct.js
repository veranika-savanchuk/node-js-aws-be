import { Client } from 'pg';
import { insertToProductTable, insertToStocksTable } from '../sql/query';
import { validateProduct } from '../utils/validations';
import { DB_OPTIONS } from '../constants';

export const createProduct = async (product = {}) => {
    const { title = '', description = '', price = null, count = null } = product;
    const client = new Client(DB_OPTIONS);
    await client.connect();

    try {
        const isValid = await validateProduct({ title, description, price, count });

        if (!isValid) {
            return {statusCode: '400', error: 'BAD REQUEST'}
        }
        await client.query('BEGIN');

        const { rows: [{ id }] } = await client.query(insertToProductTable,[title, description, price]);
        await client.query(insertToStocksTable, [id, count]);
        await client.query('COMMIT');

        return { statusCode: '200', id }
    } catch (e) {
        await client.query('ROLLBACK');

        return {statusCode: '500', error: 'Internal Server Error'}
    } finally {
        client.end();
    }
};
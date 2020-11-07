import { Client } from 'pg';
import { selectProductById } from '../sql/query';
import { HEADERS, DB_OPTIONS } from "../constants";


export const getProductById = async (event) => {
    const client = new Client(DB_OPTIONS);
    await client.connect();

    try {
        const  { pathParameters: { productId = '' } = {} } = event;

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
        // in case if error was occurred, connection will not close automatically
        client.end(); // manual closing of connection
    }
};


import { Client } from 'pg';
import { selectAllProducts } from '../sql/query';
import { HEADERS, DB_OPTIONS } from "../constants";

export const getProductsList = async () => {
    const client = new Client(DB_OPTIONS);
    await client.connect();
    try {
        const res = await client.query(selectAllProducts);

        const { rows } = res;

        return {
            statusCode: res.status,
            headers: HEADERS,
            body:  JSON.stringify(rows),
        };

    }catch (e) {
        return {
            statusCode: 500,
            headers: HEADERS,
            body: JSON.stringify({error: 'Internal Server Error'})
        }
    } finally {
    // in case if error was occurred, connection will not close automatically
    client.end(); // manual closing of connection
}

};
import { createProduct } from '../utils/addProduct';
import { HEADERS } from '../constants';

export const addProduct = async (event) => {
    console.log('Lambda function has been invoked with event:', JSON.stringify(event));

    const { body = null } = event || {};
    const product = body ? JSON.parse(body) : {};

    try {
        const { statusCode, id, error } = await createProduct(product);

        if (error) {
            return {
                statusCode,
                headers: HEADERS,
                body: JSON.stringify(error),
            };
        }

        return {
            statusCode,
            headers: HEADERS,
            body: JSON.stringify({ id }),
        };

    }catch (e) {
        return {
            statusCode: '500',
            headers: HEADERS,
            body: JSON.stringify({error: 'Internal Server Error'})
        };
    }
};
import fetch from "isomorphic-fetch";
import { FAKE_API, OPTIONS, HEADERS } from "../constants";


export const getProductById = async (event) => {
    try {
        const  { pathParameters: { productId } } = event;

        const [res, body] = await fetch(FAKE_API, OPTIONS).then(r =>
            Promise.all([Promise.resolve(r), r.text()]),
        );

        const data = JSON.parse(body);

        const productInfo = data.find(i => i.id === productId);

        if(!productInfo) {
            return {
                statusCode: 404,
                headers: HEADERS,
                body: JSON.stringify({error: 'Not found'})
            };
        }

        return {
            statusCode: res.status,
            headers: HEADERS,
            body: JSON.stringify(productInfo)
        };
    }catch (e) {
        return {
            statusCode: 500,
            headers: HEADERS,
            body: JSON.stringify({error: 'Internal Server Error'})
        };
    }
};


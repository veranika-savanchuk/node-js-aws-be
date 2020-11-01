import fetch from 'isomorphic-fetch';
import { FAKE_API, OPTIONS, HEADERS } from "../constants";

export const getProductsList = async () => {
    try {
        const [res, body] = await fetch(FAKE_API, OPTIONS).then(r =>
            Promise.all([Promise.resolve(r), r.text()]),
        );

        return {
            statusCode: res.status,
            headers: HEADERS,
            body: body,
        };

    }catch (e) {

        return {
            statusCode: 500,
            headers: HEADERS,
            body: JSON.stringify({error: 'Internal Server Error'})
        }
    }

};
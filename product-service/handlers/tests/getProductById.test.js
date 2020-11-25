import { Client } from 'pg';
import createEvent from '@serverless/event-mocks';
import { getProductById } from '../getProductById';

describe('getProductById', () => {
    describe('if id exists', () => {
        it.skip('should return product by id', async () => {
            const mockEvent = createEvent('aws:apiGateway', {
                pathParameters: {
                    productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
                },
            });

            const mock = {
                id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
                img: "https://garfield.by/upload/iblock/51f/51f702d359282a45d76664bfe03f6b36.jpg",
                count: 4,
                price: 27.6,
                title :"GiGwi Тигр с пищалкой",
                description: "Тигр с пищалкой. Размер: 36 см."
            };

            const result = await getProductById(mockEvent);
            const { statusCode, body } = result;

           expect(statusCode).toEqual(200);
           expect(JSON.parse(body)).toEqual(mock);
        });
    });
    describe('if id does not exist', () => {
        it.skip('should return Not Found', async () => {
            const mockEvent = createEvent('aws:apiGateway', {
                pathParameters: {
                    productId: '1',
                },
            });

            const mock = {
                "error": "Not found"
            };

            const result = await getProductById(mockEvent);
            const { statusCode, body } = result;

           expect(statusCode).toEqual(404);
           expect(JSON.parse(body)).toEqual(mock);
        });
    });
});
import * as awsMock from 'aws-sdk-mock'
import { importProductsFile } from '../importProductsFile'


describe('importProductsFile', () => {
    it('should return url', async () => {
        const mockUrl = '/importMock';
        awsMock.mock('S3', 'getSignedUrl', mockUrl);

        const event = { queryStringParameters: {name: 'test.csv'} };

        const response = await importProductsFile(event);

        expect(response).toEqual({
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: mockUrl
        })
        awsMock.restore('S3');
    });

    it('should reject Promise if queryStringParameters are empty', () => {
        const mockError = 'error';
        awsMock.mock("S3", "getSignedUrl", (operation, params, callback) => {
            return callback(mockError, null);
        });

        expect(importProductsFile({})).rejects.toEqual(mockError);

        awsMock.restore('S3');
    })
})
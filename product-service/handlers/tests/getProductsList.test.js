import createEvent from "@serverless/event-mocks";
import { getProductsList } from "../getProductsList";

describe('getProductsList', () => {
    it('should return array of products', async () => {
        const mockEvent = createEvent('aws:apiGateway');

        const result = await getProductsList(mockEvent);

        const { statusCode, body } = result;

        const productArrayLength =  JSON.parse(body).length;

        expect(statusCode).toEqual(200);
        expect(productArrayLength).toEqual(8);
    });
});
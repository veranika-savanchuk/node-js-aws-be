import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock'
import createEvent from "@serverless/event-mocks";
import { catalogBatchProcess } from '../catalogBatchProcess';
import { createProduct } from '../../utils/addProduct';

jest.mock("../../utils/addProduct");


describe('catalogBatchProcess', () => {

    let mockSnsPublish;

    beforeEach(() => {
        mockSnsPublish = jest.fn();
    });

    beforeAll(() => {
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('SNS', 'publish', (params, cb) => {
            mockSnsPublish();
            cb(undefined, 'success');
        });
    });

    it('should add product to db and send email', async () => {

        const mockProduct = {"title":"Test","description":"Test","price":"1","count":"1"};

        const mock = createProduct.mockImplementation(() => Promise.resolve({ statusCode: '200', id: '1234' }));

        const mocked = createEvent(
            "aws:sqs",
            {
                Records: [{
                    body:  JSON.stringify(mockProduct)
                }]
            });

        await catalogBatchProcess(mocked);

        expect(mock).toHaveBeenCalledTimes(1);
        expect(mock).toHaveBeenCalledWith(mockProduct);
        expect(mockSnsPublish).toHaveBeenCalledTimes(1);
        mock.mockClear();
    });
})
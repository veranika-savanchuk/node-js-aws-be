import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { isEmpty } from '../utils';

@Injectable()
export class ProxyService {
  proxyRequest(req): Promise<any> {
    const { originalUrl, body = null, method } = req;

    const recipient = originalUrl.split('/')[1];
    const recipientUrl = process.env[recipient];

    const data = isEmpty(body) ? undefined : body;

    const proxyRequest = {
      url: `${recipientUrl}${originalUrl}`,
      data,
      method,
    };

    return axios(proxyRequest);
  }

  exception(e): any {
    const {
      response: {
        status = HttpStatus.BAD_GATEWAY,
        data: { error = 'Cannot process request' } = {},
      } = {},
    } = e || {};
    throw new HttpException(
      {
        error: error,
      },
      status,
    );
  }
}

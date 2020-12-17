import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';
import { CacheService } from './cache.service';

const paths = ['products', 'api'];
const corsHeaders = { 'access-control-allow-origin': '*' };

@Controller()
export class ProxyController {
  constructor(
      private productService: ProxyService,
      private cacheService: CacheService
  ) {}

  @All()
  async getAnyRequest(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const url = req.originalUrl.split('/')[1];

    if (!paths.includes(url)) {
      this.productService.exception({});
    }

    try {

      const response = await this.productService.proxyRequest(req);

      const { headers, data, status } = response;

      if (url === paths[0] && req.method === 'GET') {
        if (this.cacheService.isAvailableData()) {
          const { headers: cachedHeaders, status: cachedStatus, data: cachedData } = this.cacheService.get();
          return res
              .set({ ...cachedHeaders, ...corsHeaders})
              .status(cachedStatus)
              .json(cachedData);
        }
        this.cacheService.set({ data, headers, status });
      }


      return res
        .set({ ...headers, ...corsHeaders})
        .status(status)
        .json(data);
    } catch (e) {
      this.productService.exception(e);
    }
  }
}

import { Injectable } from "@nestjs/common";


@Injectable()
export class CacheService {

    private readonly cache: any = {
        headers: {},
        data: [],
        status: 200,
        expDate: 0,
    };

    private readonly expTime: number = 120000;

    set(cache: any) {
        this.cache.data = cache.data;
        this.cache.headers = cache.headers;
        this.cache.status = cache.status;
        this.cache.expDate = Date.now() + this.expTime;
    }

    get(): any {
        return {
            data: this.cache.data,
            headers: this.cache.headers,
            status: this.cache.status,
        };
    }

    isAvailableData(): boolean {
        return !!this.cache.data.length && this.cache.expDate > Date.now();
    }
}
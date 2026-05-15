import { IApi, IProduct, IOrderData, IOrderResponse } from '../../types/index';

export class WebLarekApi {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    async getProducts(): Promise<IProduct[]> {
        const response = await this.api.get<{ items: IProduct[] }>('/product');
        return response.items; // Предполагаем, что сервер возвращает { items: IProduct[] }.
    }

    async sendOrder(data: IOrderData): Promise<IOrderResponse> {
        return await this.api.post<IOrderResponse>('/order', data);
    }
}
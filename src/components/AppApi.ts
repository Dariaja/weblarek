import { IApi, IOrder, IOrderResult, IProductsResponse } from '../types';

export class AppApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProductsResponse> {
    return this.api.get('/product/') as Promise<IProductsResponse>;
  }

  createOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post('/order/', order) as Promise<IOrderResult>;
  }
}
// Готов. проверить. (как в оно тебе надо)
// ответы с данными с сервера
import { ApiListResponse, Api } from './base/api'
import { IOrder, IOrderLot, IOrderResult, IProductItem } from './../types';

export interface ILarekApi {
  
  getCardList: () => Promise<IProductItem[]>;
  postOrderLot: (order: IOrderLot) => Promise<IOrderResult>;
}

export class LarekApi extends Api implements ILarekApi {
  readonly cdn: string;
  

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  // получение карточек с сервера
  getCardList(): Promise<IProductItem[]> {
    return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image,
      }))
    );
  }

  // получение ответа от сервера по оформленному заказу
  postOrderLot(order: IOrder): Promise<IOrderResult> {
    return this.post(`/order`, order).then((data: IOrderResult) => data);
  }
}
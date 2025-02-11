import { Api } from '../base/api'
import { IOrderLot, IOrderResult } from '../../types';

export class OrderModel extends Api {
  cdn: string;
  total: number;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
    this.total = 0;
  }
  
  // ответ от сервера по сделанному заказу
  postOrderLot(order: IOrderLot): Promise<IOrderResult> {
    return this.post(`/order`, order).then((data: IOrderResult) => data);
  }
}
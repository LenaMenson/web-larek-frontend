///дописывать


import {Model} from './base/Model';

import {FormErrors, IOrder, IOrderLot, IProductItem} from '../types/index'; 

export class ProductItem extends Model<IProductItem> {
   
        id: string;
        description: string;
        image: string;
        title: string;
        category: string;
        price: number | null;
    }

export type CatalogChangeEvent = {
        catalog: ProductItem[]
    };
 
    
export interface IAppState {
    catalog: ProductItem[]; 
    basket: string[];
    preview: ProductItem | null;
    order: IOrder | null;
    
}

export class AppState extends Model<IAppState> {
    catalog: ProductItem[] = [];
    basket: ProductItem[] = [];
    preview: ProductItem | null;
    order: IOrder = {
        payment: 'card',
        address: '',
		phone: '',
        email: '',
		total: 0,
		items: []
    };
    formErrors: FormErrors = {};
//установка каталога 
setCatalog(items: ProductItem[]) {
    console.log('установка каталога - EMIT')
    this.catalog = items.map(item => new ProductItem(item, this.events));
    this.emitChanges('catalog:changed', { catalog: this.catalog });
}
//действия, связанные с корзиной 
    
//превью карточи

//действия с заказом

//валидация полей в форме

//получение общей суммы заказа

//сборка заказа
    
}
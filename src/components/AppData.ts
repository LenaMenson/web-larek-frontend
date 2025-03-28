import {Model} from './base/Model';
import {EventEmitter, IEvents} from "./base/events";
import {FormErrors, IOrderForm, IOrder, IOrderLot, IProductItem} from '../types/index'; 

export class ProductItem extends Model<IProductItem> {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    index: number;
}      

export type CatalogChangeEvent = {
    catalog: ProductItem[]
};
    
export interface IAppState {
    catalog: ProductItem[]; 
    basketItems: string[];
    basketTotal: number;
    preview: string | null;
    order: IOrder | null; 
}

export class AppState extends Model<IAppState> {
    catalog: ProductItem[] = [];
    basketItems: string[] = [];
    basketTotal: number = 0;
    preview: ProductItem | null;
    order: IOrderForm = {
        payment: 'card',
        address: '',
		phone: '',
        email: '',
    };
    formErrors: FormErrors = {};

    constructor(data: Partial<{}>, events: EventEmitter) {
		super(data, events);
	}

//установка каталога
setCatalog(items: ProductItem[]) {
    this.catalog = items.map(item => new ProductItem(item, this.events));
    this.events.emit('catalog:changed', { catalog: this.catalog });
}

//превью карточи
setPreview(item: ProductItem) {
    this.preview = item;
    this.emitChanges('preview:change', item);
}

//действия, связанные с корзиной

//добавление товаров в корзину
addToBasket(item: ProductItem): void {
    this.basketItems.push(item.id);
    //увеличение суммы корзины на цену добавленного тавара
    this.basketTotal = this.getTotal() + item.price;
    //установка подписки на изменение корзины 
    this.events.emit('basket:changed', this.basketItems);
}

//удаление товаров из корзины
deleteFromBasket(item: ProductItem) {
    //определение индекса удаляемого элемента корзины
    const index = this.basketItems.indexOf(item.id);
    if (index >= 0) {
        this.basketItems.splice(index, 1);
        //уменьшение суммы корзины на цену удаленного тавара
        this.basketTotal = this.getTotal() - item.price;
        //установка подписки на изменение корзины 
        this.events.emit('basket:changed', this.basketItems);
    }
}

//очистка корзины и сброс полей заказа
clearBasket(): void {
    this.basketItems = [];
    this.basketTotal = 0;
    this.clearOrder();
}

//вывод кол-ва товаров в корзине
getBasketVolume(): number {
    return this.basketItems.length;
}

//проверка есть ли товар в корзине
isInBasket(item: ProductItem) {
    return this.basketItems.includes(item.id);
}

//получение суммы корзины
public getTotal() {
    return this.basketTotal;
}

//действия с заказом

//сброс полей заказа
private clearOrder(): void {
    this.order = {
        payment: 'card',//по умолчанию значение
        address: '',
        phone: '',
        email: '',
    };
}

//установка полей заказа
public setOrderField(field: keyof IOrderLot, value: string) {
    if (field === 'payment') {
        this.order.payment = value;  
    } 
    if (field === 'address') {
        this.order.address = value;
    }
    this.validateOrder()
}

//валидация полей заказа
validateOrder() { 
    const errors: typeof this.formErrors = {};
    if (!this.order.address) {
        errors.address = 'Необходимо указать адрес';
    }
    if (!this.order.payment) {
        errors.payment = 'Необходимо выбрать способ оплаты';
    }
    this.formErrors = errors;
    //установка подписки на изменение ошибок валидации
    this.events.emit('orderFormErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
}

//установка полей контактов
public setContactsField(field: keyof IOrder, value: string) {
    if (field === 'phone') {
        this.order.phone = value;
    } 
    if (field === 'email') {
        this.order.email = value;
    } 
    this.validateContacts()
}

//валидация полей контактов
validateContacts() {
    const errors: typeof this.formErrors = {};
    console.log(errors)
    if (!this.order.phone) {
        errors.phone = 'Необходимо указать телефон';
    }
    if (!this.order.email) {
        errors.email = 'Необходимо указать email';
    }
    this.formErrors = errors;
    //установка подписки на изменение ошибок валидации
    this.events.emit('contactsFormErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
}

//сборка заказа
getOrder(): IOrder {
    return { 
        ...this.order,
        items: this.basketItems, 
        total: this.basketTotal
        }     
    }
}

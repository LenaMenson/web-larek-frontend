//интерфейс товара
export interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
  }
  
  // интерфейсы формы заказа
  export interface IOrderForm {
  payment?: string;
  address?: string;
  phone?: string;
  email?: string;
  total?: string | number;
  }
  
  export interface IOrder extends IOrderForm {
    items: string[];
  }
  
  // интерфейсы данных заказа
  export interface IOrderLot{
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
  }
  
  export interface IOrderResult {
    id: string;
    total: number;
  }
  
  //интерфейс действий пользователя
  export interface IActions {
    onClick: (event: MouseEvent) => void;
  }

  // тип ошибки формы
  export type FormErrors = Partial<Record<keyof IOrder, string>>;
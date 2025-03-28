import {Form} from './common/Form';
import {IOrderForm, IActions} from "../types";
import {EventEmitter, IEvents} from "./base/events";
import {ensureElement, ensureAllElements} from "../utils/utils";

// Форма заказа с выбором способа оплаты и вводом адреса
export class OrderForm extends Form<IOrderForm> {
	protected _buttons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
			super(container, events);

			this._buttons = ensureAllElements<HTMLButtonElement>('.button_alt',	this.container);
			//событие выбора способа оплаты
			this._buttons.forEach((button) => {
				button.addEventListener('click', () => {
					//активация выбранной кнопки способа оплаты	
					this._buttons.forEach(element => {
						element.classList.toggle('button_alt-active', element === button);
					});
					//установка подписки на событие изменения способа оплаты
					events.emit('payment:changed', button);
				});
			});
	}

	//устанавка значения поля адреса в форме заказа
	set address(address: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			address;
	}
}

// Форма заказа с вводом телефона и email
export class ContactsForm extends Form<IOrderForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(phone: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = phone;
    }

    set email(email: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = email;
    }
}
//из он-тебе надо надо исправлять
// // надо наверное объединить в один класс если будет работать

import {Form} from './common/Form';
import {IOrderForm} from "../types";
import {EventEmitter, IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";


export class ContactsForm extends Form<IOrderForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(phone: string) {
		console.log(this.container);
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = phone;
    }

    set email(email: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = email;
    }
}

/**
 * Класс OrderForm представляет форму заказа с кнопками и полем адреса.
 */
export class OrderForm extends Form<IOrderForm> {
	protected _buttons: HTMLButtonElement[];
	//protected _buttonNext: HTMLButtonElement;  ///убрать

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._buttons = Array.from(container.querySelectorAll('.button_alt'));
		//this._buttonNext = container.querySelector('.button_alt'); ///убрать

		// Добавляем обработчик события для кнопки
		this._buttons.forEach((element) =>
			element.addEventListener('click', (event: MouseEvent) => {
				console.log('push the button')
				const target = event.target as HTMLButtonElement;
				const name = target.name;
				this.setButtonClass(name);
				events.emit('payment:changed', { target: name });
				console.log('изменение способа оплаты - EMIT')
			})
		);
	}

	//активация выбранной кнопки способа оплаты и снятие класса с другой
	
	setButtonClass(name: string): void {
		console.log('setButtonClasss')
		this._buttons.forEach((button) => {
			if (button.name === name) {
				console.log(button.name)
				button.classList.add('button_alt-active');
			} else {
				button.classList.remove('button_alt-active');
			}
		});
	}

	//устанавка значения поля адреса в форме заказа.
	 
	set address(address: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			address;
	}

    
}
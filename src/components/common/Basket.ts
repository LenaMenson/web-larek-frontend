//??? проверить. (как в оно тебе надо)

import { Component } from '../base/component';
import { createElement, ensureElement, numberToString } from '../../utils/utils';
import { EventEmitter } from '../base/events';

interface IBasketState {
	items: HTMLElement[];
	total: number;
}
/*
interface IBasketView {
    items: HTMLElement[];
    total: number;
    // selected: string[];
}*/

export class Basket extends Component<IBasketState> {
    protected _itemsList: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._itemsList = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                console.log ('открытие заказа - EMIT')
                events.emit('order:open');
            });
        }

        this.items = []; /// ?????????????
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._itemsList.replaceChildren(...items);
            
        } else {
            this._itemsList.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            
        }
    }

    set selected(items: string[]) {
        if (items.length) {
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
        }
    }

    set total(total: number) {
        this.setText(this._total, numberToString(total)); // формат переделала
    }
}

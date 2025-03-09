//дописывать

import {Component} from "./base/component";
import { IActions} from "../types";

import {ensureElement, numberToString} from "../utils/utils";
import {ProductItem} from "./AppData";

/* это из тайпс индекс
interface ICardActions {
    onClick: (event: MouseEvent) => void;
}
interface IActions {
    onClick: (event: MouseEvent) => void;
  }

interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
  }
*/
export const categories: Record<string, string> = {
	'другое': 'card__category_other',
	'софт-скил': 'card__category_soft',
	'дополнительное': 'card__category_additional',
	'кнопка': 'card__category_button',
	'хард-скил': 'card__category_hard',
}

  export type CardData = ProductItem & {
		button?: string;
        
};

/////////////////// дописала
export class Card extends Component<CardData> {
    protected _description?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IActions) {
        super(container);
        
        this._description = this.container.querySelector('.card__text');
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._button = this.container.querySelector('.card__button');
       
        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }

    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }
    set description(value: string) {
		this.setText(this._description, value);
	}

    set image(value: string) {
		if (this._image) {
			this.setImage(this._image, value, this.title);
		}
	}

    set title(value: string) {
            this.setText(this._title, value);
        }
    
    get title(): string {
            return this._title.textContent || '';
        }

    set category(value: string) {
		this.setText(this._category, value);
		if (this._category) {
			this._category.classList.add(
				`card__category_${categories[value] ? categories[value] : 'other'}`
			);
		};
	}

    set price(value: number) {
		this.setText(this._price, value ? `${numberToString(value)} синапсов` : 'Бесценно');
		if (this._button) {
			this._button.disabled = !value;
		}
	}

    get price(): number {
		return Number(this._price.textContent.replace(/\D/g, ''));
    }
    
    set button(value: string) {
            this.setText(this._button, value);
        }
	}






    export class CardInBasket extends Component<CardData> {
        protected _basketIndex: HTMLElement;
        protected _deleteFromBasketButton: HTMLButtonElement;
    
        constructor(container: HTMLElement, actions?: IActions) {
            super(container);
            this._basketIndex = container.querySelector(`.basket__item-index`);
            this._deleteFromBasketButton = container.querySelector(`.basket__item-delete`);
           
        ///удаление из корзины
    
       
    }
}
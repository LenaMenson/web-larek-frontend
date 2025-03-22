import {Component} from "./base/component";
import { IActions} from "../types";
import {ensureElement, numberToString} from "../utils/utils";
import {ProductItem} from "./AppData";

//категории товаров и соответствующие им классы
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

//карточка товара, получаемая с сервера
export class Card extends Component<CardData> {
    protected _description?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category?: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;
   
    constructor(container: HTMLElement, actions?: IActions) {
        super(container);
        
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._title = ensureElement<HTMLElement>('.card__title', container);

        this._description = this.container.querySelector('.card__text');
       
        this._image = this.container.querySelector('.card__image');        
        this._category = this.container.querySelector('.card__category');
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
        this._category.classList.add(`${categories[value]}`)
	}

    set price(value: number) {
		this.setText(this._price, value ? `${String(value)} синапсов` : 'Бесценно');
		if (this._button) {
			this._button.disabled = !value;
		}
	}
    
    set button(value: string) {
            this.setText(this._button, value);
        }
}

//карточка товара - элемент в корзине
export class CardInBasket extends Component<CardData> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _index: HTMLElement;
    protected _deleteFromBasketButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IActions) {
        super(container);
        
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);

        this._index = container.querySelector(`.basket__item-index`);
        this._deleteFromBasketButton = container.querySelector(`.basket__item-delete`);
       
        ///удаление из корзины     
		if (actions?.onClick) {
			this._deleteFromBasketButton.addEventListener('click', actions.onClick);
		}
    }
    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number) {
        this.setText(this._price, value);
    
    }
    set index (value: number) {
		if (this._index) {
			this._index.textContent = String(value);
		}
	}
}
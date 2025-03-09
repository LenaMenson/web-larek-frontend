//Вроде исправила. внизу оно т надо. надо в сет тотал возможно исправить

import { Component } from '../base/component';
import { ensureElement, numberToString } from '../../utils/utils';


interface ISuccess {
	total: number;
}

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _totalDescription: HTMLElement;
	protected _closeBtn: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._totalDescription = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this._closeBtn = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);

		if (actions.onClick) {
			this._closeBtn.addEventListener('click', actions.onClick);
		}
	}

	set total(total: number) {
		this.setText(this._totalDescription, `Списано ${numberToString(total)} синапсов`);
	}
}
/*

export class Success extends Component<ISuccess> {
    protected _close: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._close = ensureElement<HTMLElement>('.state__action', this.container);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }
}
    */
import { Component } from '../base/component';
import { ensureElement} from '../../utils/utils';

interface ISuccess {
	total: string | number;
}

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _totalSuccess: HTMLElement;
	protected _closeSuccess: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._totalSuccess = ensureElement<HTMLElement>('.order-success__description', this.container);
		this._closeSuccess = ensureElement<HTMLElement>('.order-success__close', this.container);

		if (actions?.onClick) {
			this._closeSuccess.addEventListener('click', actions.onClick);
		}
	}

	set totalSuccess(total: string | number) {
		this.setText(this._totalSuccess, `Списано ${total} синапсов`);
	}
}

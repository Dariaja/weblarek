import { Form } from "./Form";

interface IOrderForm {
    payment: string;
    address: string;
}

export class OrderForm extends Form<IOrderForm> {
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: any) {
        super(container, events);

        this._cardButton = container.querySelector('button[name=card]')!;
        this._cashButton = container.querySelector('button[name=cash]')!;

        // Обработка кликов по кнопкам выбора оплаты
        if (this._cardButton) {
            this._cardButton.addEventListener('click', () => {
                this.payment = 'online';
                this.onInputChange('payment', 'online');
            });
        }
        if (this._cashButton) {
            this._cashButton.addEventListener('click', () => {
                this.payment = 'cash';
                this.onInputChange('payment', 'cash');
            });
        }
    }

    set payment(value: string) {
        if (this._cardButton && this._cashButton) {
            this._cardButton.classList.toggle('button_alt-active', value === 'online');
            this._cashButton.classList.toggle('button_alt-active', value === 'cash');
        }
    }

    set address(value: string) {
        const input = this.container.querySelector('input[name=address]') as HTMLInputElement;
        if (input) input.value = value;
    }
}
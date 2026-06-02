import { Component } from "../../base/Component";

interface ISuccessView {
    total: number;
}

export class SuccessView extends Component<ISuccessView> {
    protected _closeButton: HTMLButtonElement;
    protected _description: HTMLElement;

    constructor(container: HTMLElement, protected events: { emit: (event: string) => void }) {
        super(container);

        this._closeButton = container.querySelector('.order-success__close')!;
        this._description = container.querySelector('.order-success__description')!;

        if (this._closeButton) {
            this._closeButton.addEventListener('click', () => {
                this.events.emit('success:close');
            });
        }
    }

    set total(value: number) {
        if (this._description) {
            this._description.textContent = `Списано ${value} синапсов`;
        }
    }
}
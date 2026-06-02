import { Component } from "../../base/Component";

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class BasketView extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: { emit: (event: string, data?: any) => void }) {
        super(container);

        this._list = container.querySelector('.basket__list')!;
        this._total = container.querySelector('.basket__price')!;
        this._button = container.querySelector('.basket__button')!;

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            if (this._button) {
                this._button.disabled = false;
            }
        } else {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'Корзина пуста'; 
            this._list.replaceChildren(emptyMessage);
            
            if (this._button) {
                this._button.disabled = true;
            }
        }
    }

    set total(total: number) {
        if (this._total) {
            this._total.textContent = `${total} синапсов`;
        }
    }
}
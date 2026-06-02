// ИСПРАВЛЕНО: Правильный путь к соседней папке cards/Card
import { Card } from "../cards/Card";

interface IBasketItemActions {
    onClick: (event: MouseEvent) => void;
}

export class BasketItem extends Card {
    protected _index: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IBasketItemActions) {
        super(container);

        this._index = container.querySelector(".basket__item-index")!;
        this._button = container.querySelector(".basket__item-delete")!;

        if (actions?.onClick && this._button) {
            this._button.addEventListener("click", actions.onClick);
        }
    }

    set index(value: number) {
        if (this._index) {
            this._index.textContent = String(value);
        }
    }
}
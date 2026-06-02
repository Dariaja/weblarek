import { Component } from "../../base/Component";

export interface ICardView {
    title: string;
    price: number | null;
}

export class Card extends Component<ICardView> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._title = container.querySelector(".card__title")!;
        this._price = container.querySelector(".card__price")!;
    }

    set title(value: string) {
        if (this._title) {
            this._title.textContent = value;
        }
    }

    set price(value: number | null) {
        if (value === null) {
            this._price.textContent = "Бесценно";
        } else {
            this._price.textContent = `${value} синапсов`;
        }
    }
}
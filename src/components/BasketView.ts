import { Component } from "./base/Component";
import { IEvents } from "./base/Events";

interface IBasketViewData {
  items: HTMLElement[];
  total: number;
}

export class BasketView extends Component<IBasketViewData> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._list = container.querySelector(".basket__list")!;
    this._total = container.querySelector(".basket__price")!;
    this._button = container.querySelector(
      ".basket__button",
    ) as HTMLButtonElement;

    this._button?.addEventListener("click", () => {
      events.emit("basket:open-order");
    });
  }

  set items(value: HTMLElement[]) {
    if (value.length > 0) {
      this._list.replaceChildren(...value);
      if (this._button) this._button.disabled = false;
    } else {
      const emptyText = document.createElement("p");
      emptyText.className = "basket__empty-text";
      emptyText.textContent = "Корзина пуста";
      this._list.replaceChildren(emptyText);

      if (this._button) this._button.disabled = true;
    }
  }

  set total(value: number) {
    if (this._total) {
      this._total.textContent = `${value} синапсов`;
    }
  }
}

import { Component } from "./base/Component";
import { IEvents } from "./base/Events";

interface IHeaderData {
  counter: number;
}

export class Header extends Component<IHeaderData> {
  protected _counter: HTMLElement;
  protected _basketButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._counter = container.querySelector(".header__basket-counter")!;
    this._basketButton = container.querySelector(
      ".header__basket",
    ) as HTMLButtonElement;

    this._basketButton?.addEventListener("click", () => {
      events.emit("header:open-basket");
    });
  }

  set counter(value: number) {
    if (this._counter) {
      this._counter.textContent = String(value);
    }
  }
}

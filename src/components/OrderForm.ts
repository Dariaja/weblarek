import { Form } from "./Form";
import { IBuyer } from "../types";
import { IEvents } from "./base/Events";

export class OrderForm extends Form<Partial<IBuyer>> {
  protected _cardButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._cardButton = container.querySelector(
      "button[name=card]",
    ) as HTMLButtonElement;
    this._cashButton = container.querySelector(
      "button[name=cash]",
    ) as HTMLButtonElement;

    this._cardButton?.addEventListener("click", () => {
      this.payment = "online";
      this.events.emit("order:payment-changed", { payment: "online" });
    });

    this._cashButton?.addEventListener("click", () => {
      this.payment = "cash";
      this.events.emit("order:payment-changed", { payment: "cash" });
    });
  }

  set payment(value: string) {
    if (value === "online") {
      this._cardButton?.classList.add("button_alt-active");
      this._cashButton?.classList.remove("button_alt-active");
    } else if (value === "cash") {
      this._cashButton?.classList.add("button_alt-active");
      this._cardButton?.classList.remove("button_alt-active");
    } else {
      this._cardButton?.classList.remove("button_alt-active");
      this._cashButton?.classList.remove("button_alt-active");
    }
  }

  set address(value: string) {
    const input = this.container.querySelector(
      "input[name=address]",
    ) as HTMLInputElement;
    if (input) {
      input.value = value;
    }
  }
}

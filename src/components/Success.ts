import { Component } from "./base/Component";

interface ISuccess {
  total: number;
}

interface ISuccessActions {
  onClick: () => void;
}

export class Success extends Component<ISuccess> {
  protected _close: HTMLButtonElement;
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions: ISuccessActions) {
    super(container);

    this._close = container.querySelector(
      ".order-success__close",
    ) as HTMLButtonElement;
    this._description = container.querySelector(".order-success__description")!;

    if (actions?.onClick && this._close) {
      this._close.addEventListener("click", actions.onClick);
    }
  }

  set total(value: number) {
    if (this._description) {
      this._description.textContent = `Списано ${value} синапсов`;
    }
  }
}

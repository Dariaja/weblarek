import { Component } from "./base/Component";
import { IEvents } from "./base/Events";

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this._closeButton = container.querySelector(".modal__close")!;
    this._content = container.querySelector(".modal__content")!;

    this._closeButton.addEventListener("click", () => this.close());
    this.container.addEventListener("click", (entry) => {
      if (entry.target === this.container) {
        this.close();
      }
    });
  }

  set content(value: HTMLElement | null) {
    if (value) {
      this._content.replaceChildren(value);
    } else {
      this._content.replaceChildren();
    }
  }

  open() {
    this.container.classList.add("modal_active");
    this.events.emit("modal:open");
  }

  close() {
    this.container.classList.remove("modal_active");
    this.content = null;
    this.events.emit("modal:close");
  }
}

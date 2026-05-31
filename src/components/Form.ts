import { Component } from "./base/Component";
import { IEvents } from "./base/Events";

interface IFormState {
  valid: boolean;
  errors: string[];
}

export class Form<T> extends Component<IFormState> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this.events = events;

    this._submit = container.querySelector(
      "button[type=submit]",
    ) as HTMLButtonElement;
    this._errors = container.querySelector(".form__errors")!;

    this.container.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;

      this.events.emit(`${container.name}:${String(field)}-changed`, {
        field,
        value,
      });
    });

    this.container.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      this.events.emit(`${container.name}:submit`);
    });
  }

  set errors(value: string[] | undefined) {
    if (Array.isArray(value)) {
      this._errors.textContent = value.join(", ");
    } else {
      this._errors.textContent = "";
    }
  }

  set valid(value: boolean) {
    this._submit.disabled = !value;
  }

  clear() {
    (this.container as HTMLFormElement).reset();
  }

  render(state?: Partial<IFormState> & T) {
    if (state) {
      const { valid, errors, ...inputs } = state;
      super.render({ valid, errors });
      Object.assign(this, inputs);
    }
    return this.container;
  }
}

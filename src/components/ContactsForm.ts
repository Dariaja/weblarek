import { Form } from "./Form";
import { IBuyer } from "../types";
import { IEvents } from "./base/Events";

export class ContactsForm extends Form<Partial<IBuyer>> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }

  set email(value: string) {
    const input = this.container.querySelector(
      "input[name=email]",
    ) as HTMLInputElement;
    if (input) {
      input.value = value;
    }
  }

  set phone(value: string) {
    const input = this.container.querySelector(
      "input[name=phone]",
    ) as HTMLInputElement;
    if (input) {
      input.value = value;
    }
  }
}

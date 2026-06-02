import { IBuyer, TPayment, TBuyerErrors } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  protected payment: TPayment | null = null;
  protected email: string = "";
  protected phone: string = "";
  protected address: string = "";
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
      this.events.emit("buyer:payment-changed", { payment: this.payment });
    }
    if (data.email !== undefined) {
      this.email = data.email;
      this.events.emit("buyer:email-changed", { email: this.email });
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
      this.events.emit("buyer:phone-changed", { phone: this.phone });
    }
    if (data.address !== undefined) {
      this.address = data.address;
      this.events.emit("buyer:address-changed", { address: this.address });
    }

    this.events.emit("buyer:changed", this.getData());
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
    this.events.emit("buyer:cleared");
  }

  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};

    if (!this.payment) {
        errors.payment = 'Выберите способ оплаты';
    }
    if (!this.address || this.address.trim() === '') {
        errors.address = 'Укажите адрес доставки';
    }
    if (!this.email || this.email.trim() === '') {
        errors.email = 'Укажите адрес электронной почты';
    }
    if (!this.phone || this.phone.trim() === '') {
        errors.phone = 'Укажите номер телефона';
    }

    this.events.emit('buyer:errors', errors);

    return errors;
  }
}

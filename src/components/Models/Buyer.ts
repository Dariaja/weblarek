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

    if (!this.address || this.address.trim() === "") {
      errors.address = "Необходимо указать адрес доставки";
    }

    if (!this.payment) {
      errors.payment = "Необходимо выбрать способ оплаты";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email) {
      errors.email = "Необходимо указать email";
    } else if (!emailRegex.test(this.email)) {
      errors.email = "Некорректный формат адреса электронной почты";
    }

    const phoneRegex = /^\+?[0-9\s\-()]{10,20}$/;
    if (!this.phone) {
      errors.phone = "Необходимо указать номер телефона";
    } else if (!phoneRegex.test(this.phone) || !/[0-9]/.test(this.phone)) {
      errors.phone = "Некорректный формат номера телефона";
    }

    return errors;
  }
}

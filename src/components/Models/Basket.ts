import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
  protected items: IProduct[] = [];
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    this.items.push(item);
    this.events.emit("cart:changed", { items: this.items });
  }

  removeItem(item: IProduct): void {
    this.items = this.items.filter((product) => product.id !== item.id);
    this.events.emit("cart:changed", { items: this.items });
  }

  clear(): void {
    this.items = [];
    this.events.emit("cart:changed", { items: this.items });
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + (item.price || 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}

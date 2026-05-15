import { IProduct } from "../../../types/index"; // Импорт интерфейса IProduct

export class Basket {
  private _items: IProduct[];

  constructor() {
    this._items = [];
  }

  getItems(): IProduct[] {
    return this._items;
  }

  addItem(item: IProduct): void {
    this._items.push(item);
  }

  removeItem(item: IProduct): void {
    const index = this._items.findIndex((i) => i.id === item.id);
    if (index > -1) {
      this._items.splice(index, 1);
    }
  }

  clear(): void {
    this._items = [];
  }

  getTotal(): number {
    return this._items.reduce((total, item) => total + (item.price || 0), 0);
  }

  getCount(): number {
    return this._items.length;
  }

  hasItem(id: string): boolean {
    return this._items.some((item) => item.id === id);
  }
}

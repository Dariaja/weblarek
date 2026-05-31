import { Component } from "./base/Component";
import { IProduct } from "../types";
import { categoryMap, CDN_URL } from "../utils/constants";

export class Card extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _image?: HTMLImageElement | null;
  protected _category?: HTMLElement | null;
  protected _button?: HTMLButtonElement | null;

  constructor(
    container: HTMLElement,
    actions?: { onClick: (event: MouseEvent) => void },
  ) {
    super(container);

    this._title = container.querySelector(".card__title")!;
    this._price = container.querySelector(".card__price")!;

    this._image = container.querySelector(".card__image");
    this._category = container.querySelector(".card__category");
    this._button = container.querySelector(".card__button");

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener("click", actions.onClick);
      } else {
        container.addEventListener("click", actions.onClick);
      }
    }
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set title(value: string) {
    if (this._title) {
      this._title.textContent = value;
    }
  }

  set price(value: number | null) {
    if (value === null) {
      this._price.textContent = "Бесценно";
      if (this._button) {
        this._button.disabled = true;
        this._button.textContent = "Недоступно";
      }
    } else {
      this._price.textContent = `${value} синапсов`;
      if (this._button) {
        this._button.disabled = false;
      }
    }
  }

  set category(value: string) {
    if (this._category) {
      this._category.textContent = value;
      this.categoryColor = value;
    }
  }

  set image(value: string) {
    if (this._image) {
      this.setImage(this._image, CDN_URL + value, this.title);
    }
  }

  set categoryColor(value: string) {
    if (this._category) {
      Object.values(categoryMap).forEach((className) => {
        this._category!.classList.remove(className);
      });

      const mappedClass = categoryMap[value as keyof typeof categoryMap];
      if (mappedClass) {
        this._category.classList.add(mappedClass);
      }
    }
  }
}

export class CatalogItem extends Card {
  constructor(
    container: HTMLElement,
    actions?: { onClick: (event: MouseEvent) => void },
  ) {
    super(container, actions);
  }
}

export class PreviewItem extends Card {
  protected _description: HTMLElement | null;

  constructor(
    container: HTMLElement,
    actions?: { onClick: (event: MouseEvent) => void },
  ) {
    super(container, actions);
    this._description = container.querySelector(".card__text");
  }

  set description(value: string) {
    if (this._description) {
      this._description.textContent = value;
    }
  }
}

export class BasketItem extends Card {
  protected _index: HTMLElement | null;

  constructor(
    container: HTMLElement,
    actions?: { onClick: (event: MouseEvent) => void },
  ) {
    super(container, actions);
    this._index = container.querySelector(".basket__item-index");
  }

  set index(value: number) {
    if (this._index) {
      this._index.textContent = String(value);
    }
  }
}

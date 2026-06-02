import { Card } from "./Card";
import { categoryMap, CDN_URL } from "../../../utils/constants";

export class CatalogItem extends Card {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;

    constructor(container: HTMLElement, actions?: { onClick: (event: MouseEvent) => void }) {
        super(container);

        this._image = container.querySelector(".card__image")!;
        this._category = container.querySelector(".card__category")!;

        if (actions?.onClick) {
            container.addEventListener("click", actions.onClick);
        }
    }

    set category(value: string) {
        if (this._category) {
            this._category.textContent = value;
            
            Object.values(categoryMap).forEach((className) => {
                this._category.classList.remove(className);
            });

            const mappedClass = categoryMap[value as keyof typeof categoryMap];
            if (mappedClass) {
                this._category.classList.add(mappedClass);
            }
        }
    }

    set image(value: string) {
        if (this._image) {
            this._image.src = CDN_URL + value;
            this._image.alt = this.title;
        }
    }
}
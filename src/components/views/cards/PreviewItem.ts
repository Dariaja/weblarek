import { CatalogItem } from "./CatalogItem";

interface IPreviewActions {
    onClick: (event: MouseEvent) => void;
}

export class PreviewItem extends CatalogItem {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IPreviewActions) {
        super(container);

        this._description = container.querySelector(".card__text")!;
        this._button = container.querySelector(".card__button")!;

        if (actions?.onClick && this._button) {
            this._button.addEventListener("click", actions.onClick);
        }
    }

    set description(value: string) {
        if (this._description) {
            this._description.textContent = value;
        }
    }

    set buttonText(value: string) {
        if (this._button) {
            this._button.textContent = value;
        }
    }

    set valid(hasPrice: boolean) { 
        if (this._button) { 
            this._button.disabled = !hasPrice; 
        }
    }
}
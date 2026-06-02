import { Component } from "../../base/Component";

interface IFormState {
    valid: boolean;
    errors: string[];
}

export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLFormElement, protected events: { emit: (event: string, data?: any) => void }) {
        super(container);

        this._submit = container.querySelector('button[type=submit]')!;
        this._errors = container.querySelector('.form__errors')!;

        // Слушаем ввод в поля формы
        container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${container.name}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${(this.container as HTMLFormElement).name}.${String(field)}:change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        if (this._submit) {
            this._submit.disabled = !value;
        }
    }

    set errors(value: string[]) {
        if (this._errors) {
            this._errors.textContent = value.join(', ');
        }
    }
}
import { Form } from "./Form"; 

interface IContactsForm { 
    email: string; 
    phone: string; 
} 

export class ContactsForm extends Form<IContactsForm> { 
    protected _emailInput: HTMLInputElement | null; 
    protected _phoneInput: HTMLInputElement | null; 

    constructor(container: HTMLFormElement, events: any) { 
        super(container, events); 

        this._emailInput = container.querySelector('input[name=email]'); 
        this._phoneInput = container.querySelector('input[name=phone]'); 
    } 

    set email(value: string) { 
        if (this._emailInput) {
            this._emailInput.value = value; 
        }
    } 

    set phone(value: string) { 
        if (this._phoneInput) {
            this._phoneInput.value = value; 
        }
    } 
}
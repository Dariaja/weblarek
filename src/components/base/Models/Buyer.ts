import { IBuyer, TPayment } from '../../../types/index'; // Импорт интерфейса IBuyer и типа TPayment

export class Buyer {
    private _payment: TPayment | null;
    private _email: string;
    private _phone: string;
    private _address: string; 

    constructor() {
        this._payment = null;
        this._email = '';
        this._phone = '';
        this._address = '';
    }

    setPayment(payment: TPayment): void {
        this._payment = payment;
    }

    getPayment(): TPayment | null {
        return this._payment;
    }

    setEmail(email: string): void {
        this._email = email;
    }

    getEmail(): string {
        return this._email;
    }

    setPhone(phone: string): void {
        this._phone = phone;
    }

    getPhone(): string {
        return this._phone;
    }

    setAddress(address: string): void {
        this._address = address;
    }

    getAddress(): string {
        return this._address;
    }

    getBuyerData(): IBuyer {
        if (!this._payment) {
            throw new Error('Payment method is not set');
        }
        return {
            payment: this._payment,
            email: this._email,
            phone: this._phone,
            address: this._address
        };
    }

    clear(): void {
        this._payment = null;
        this._email = '';
        this._phone = '';
        this._address = '';
    }

    validate(): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/; 
        return (
            this._payment !== null &&
            emailRegex.test(this._email) &&
            phoneRegex.test(this._phone) &&
            this._address.trim() !== ''
        );
    }
}
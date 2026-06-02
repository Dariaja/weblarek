import "./scss/styles.scss";
import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";

import { Products } from "./components/Models/Products";
import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";

import { CatalogItem } from "./components/views/cards/CatalogItem";
import { PreviewItem } from "./components/views/cards/PreviewItem";
import { BasketItem } from "./components/views/basket/BasketItem";
import { BasketView } from "./components/views/basket/BasketView";
import { Modal } from "./components/Modal";
import { OrderForm } from "./components/views/order/OrderForm";
import { ContactsForm } from "./components/views/order/ContactsForm";
import { SuccessView } from "./components/views/order/Success"; 

import { API_URL } from "./utils/constants";
import { AppApi } from "./components/AppApi";
import { IProduct, TPayment } from "./types";

const events = new EventEmitter();
const apiInstance = new Api(API_URL);
const webLarekApiInstance = new AppApi(apiInstance);

const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

const galleryElement = document.querySelector(".gallery") as HTMLElement;
const basketHeaderButton = document.querySelector(".header__basket") as HTMLButtonElement;
const basketCounter = document.querySelector(".header__basket-counter") as HTMLElement;

const cardCatalogTemplate = document.querySelector("#card-catalog") as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector("#card-preview") as HTMLTemplateElement;
const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector("#card-basket") as HTMLTemplateElement;
const orderTemplate = document.querySelector("#order") as HTMLTemplateElement;
const contactsTemplate = document.querySelector("#contacts") as HTMLTemplateElement;
const successTemplate = document.querySelector("#success") as HTMLTemplateElement;

const modal = new Modal(document.querySelector("#modal-container") as HTMLElement, events);
const basketView = new BasketView(basketTemplate.content.querySelector(".basket")!.cloneNode(true) as HTMLElement, events);
const orderForm = new OrderForm(orderTemplate.content.querySelector(".form")!.cloneNode(true) as HTMLFormElement, events);
const contactsForm = new ContactsForm(contactsTemplate.content.querySelector(".form")!.cloneNode(true) as HTMLFormElement, events);
const successView = new SuccessView(successTemplate.content.querySelector(".order-success")!.cloneNode(true) as HTMLElement, events);

const previewCard = new PreviewItem(cardPreviewTemplate.content.querySelector(".card_full")!.cloneNode(true) as HTMLElement, {
    onClick: () => {
        const currentItem = productsModel.getPreview();
        if (currentItem) {
            if (basketModel.hasItem(currentItem.id)) {
                basketModel.removeItem(currentItem);
            } else {
                basketModel.addItem(currentItem);
            }
            modal.close();
        }
    }
});

events.on("products:changed", (data: { items: IProduct[] }) => {
    const cardsArray = data.items.map((item) => {
        const cardElement = cardCatalogTemplate.content.querySelector(".gallery__item")!.cloneNode(true) as HTMLElement;
        const card = new CatalogItem(cardElement, {
            onClick: () => events.emit("card:select", item)
        });
        return card.render({
            title: item.title,
            price: item.price,
            category: item.category,
            image: item.image
        } as any);
    });
    galleryElement.replaceChildren(...cardsArray);
});

events.on("card:select", (item: IProduct) => {
    productsModel.setPreview(item);
});

events.on("preview:changed", (item: IProduct) => {
    const isInBasket = basketModel.hasItem(item.id);
    
    previewCard.buttonText = isInBasket ? "Удалить из корзины" : "В корзину";
    previewCard.valid = item.price !== null;

    modal.content = previewCard.render({
        title: item.title,
        price: item.price,
        category: item.category,
        image: item.image,
        description: item.description
    } as any);
    modal.open();
});

basketHeaderButton.addEventListener("click", () => {
    modal.content = basketView.render();
    modal.open();
});

events.on("cart:changed", () => {
    const itemsInBasket = basketModel.getItems(); 
    
    basketCounter.textContent = String(itemsInBasket.length);
    basketView.total = basketModel.getTotal();

    basketView.items = itemsInBasket.map((item, index) => {
        const itemElement = cardBasketTemplate.content.querySelector(".card_compact")!.cloneNode(true) as HTMLElement;
        const basketItem = new BasketItem(itemElement, {
            onClick: () => basketModel.removeItem(item)
        });
        return basketItem.render({
            title: item.title,
            price: item.price,
            index: index + 1 
        } as any);
    });
});

events.on("order:open", () => {
    buyerModel.setData({});
    modal.content = orderForm.render();
    modal.open();
});

events.on(/^order\..*:change$/, (data: { field: string; value: any }) => {
    buyerModel.setData({ [data.field]: data.value });
    buyerModel.validate();
});

events.on("order:submit", () => {
    modal.content = contactsForm.render();
});

events.on(/^contacts\..*:change$/, (data: { field: string; value: string }) => {
    buyerModel.setData({ [data.field]: data.value });
    buyerModel.validate();
});

events.on("buyer:errors", (errors: Partial<Record<string, string>>) => {
    const orderFields: Array<'payment' | 'address'> = ['payment', 'address'];
    const contactsFields: Array<'email' | 'phone'> = ['email', 'phone'];

    const hasOrderErrors = orderFields.some(field => !!errors[field]);
    orderForm.valid = !hasOrderErrors;
    orderForm.errors = orderFields.map(field => errors[field]).filter(Boolean) as string[];

    const hasContactsErrors = contactsFields.some(field => !!errors[field]);
    contactsForm.valid = !hasContactsErrors;
    contactsForm.errors = contactsFields.map(field => errors[field]).filter(Boolean) as string[];
});

events.on("contacts:submit", async () => {
    try {
        const basketItems = basketModel.getItems();
        const buyerData = buyerModel.getData();

        const orderPayload = {
            payment: buyerData.payment as TPayment,
            address: buyerData.address,
            email: buyerData.email,
            phone: buyerData.phone,
            total: basketModel.getTotal(),
            items: basketItems.map(item => item.id)
        };

        const result = await webLarekApiInstance.createOrder(orderPayload);

        basketModel.clear();
        buyerModel.clear();

        modal.content = successView.render({
            total: result.total
        });
    } catch {
        contactsForm.errors = ["Не удалось отправить заказ. Попробуйте позже."];
    }
});

events.on("success:close", () => {
    modal.close();
});

(async () => {
    try {
        const productsResponse = await webLarekApiInstance.getProducts();
        productsModel.setItems(productsResponse.items);
    } catch {
    }
})();
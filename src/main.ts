import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";

import { Products } from "./components/Models/Products";
import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";

import { CatalogItem, PreviewItem, BasketItem } from "./components/Card";
import { Modal } from "./components/Modal";
import { Header } from "./components/Header";
import { BasketView } from "./components/BasketView";
import { OrderForm } from "./components/OrderForm";
import { ContactsForm } from "./components/ContactsForm";
import { Success } from "./components/Success";

import { API_URL } from "./utils/constants";
import { AppApi } from "./components/AppApi";
import { IProduct, IOrder } from "./types";

// 1. ИНИЦИАЛИЗАЦИЯ КЛАССОВ И ИНФРАСТРУКТУРЫ

const events = new EventEmitter();
const apiInstance = new Api(API_URL);
const webLarekApiInstance = new AppApi(apiInstance);

const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

const galleryElement = document.querySelector(".gallery") as HTMLElement;
const cardCatalogTemplate = document.querySelector(
  "#card-catalog",
) as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector(
  "#card-preview",
) as HTMLTemplateElement;
const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const orderTemplate = document.querySelector("#order") as HTMLTemplateElement;
const contactsTemplate = document.querySelector(
  "#contacts",
) as HTMLTemplateElement;
const successTemplate = document.querySelector(
  "#success",
) as HTMLTemplateElement;

const modal = new Modal(
  document.querySelector("#modal-container") as HTMLElement,
  events,
);
const header = new Header(
  document.querySelector(".page__wrapper") as HTMLElement,
  events,
);

const basketElement = (
  basketTemplate.content.querySelector(".basket") as HTMLElement
).cloneNode(true) as HTMLElement;
const basketView = new BasketView(basketElement, events);

const orderFormElement = (
  orderTemplate.content.querySelector(".form") as HTMLFormElement
).cloneNode(true) as HTMLFormElement;
const orderForm = new OrderForm(orderFormElement, events);

const contactsFormElement = (
  contactsTemplate.content.querySelector(".form") as HTMLFormElement
).cloneNode(true) as HTMLFormElement;
const contactsForm = new ContactsForm(contactsFormElement, events);

const successElement = (
  successTemplate.content.querySelector(".order-success") as HTMLElement
).cloneNode(true) as HTMLElement;
const successView = new Success(successElement, {
  onClick: () => {
    modal.close();
  },
});

// 2. СЛУШАТЕЛИ СОБЫТИЙ (Presenter Logic)

events.on("products:changed", (data: { items: IProduct[] }) => {
  const cardsArray = data.items.map((item) => {
    const cardElement = (
      cardCatalogTemplate.content.querySelector(".card") as HTMLElement
    ).cloneNode(true) as HTMLElement;
    const card = new CatalogItem(cardElement, {
      onClick: () => events.emit("card:select", item),
    });
    return card.render(item);
  });
  galleryElement.replaceChildren(...cardsArray);
});

events.on("card:select", (item: IProduct) => {
  productsModel.setPreview(item);
});

events.on("preview:changed", (item: IProduct) => {
  const cardElement = (
    cardPreviewTemplate.content.querySelector(".card") as HTMLElement
  ).cloneNode(true) as HTMLElement;
  const card = new PreviewItem(cardElement, {
    onClick: () => {
      if (basketModel.hasItem(item.id)) {
        basketModel.removeItem(item);
      } else {
        basketModel.addItem(item);
      }
      modal.close();
    },
  });

  const button = cardElement.querySelector(
    ".card__button",
  ) as HTMLButtonElement;
  if (button) {
    button.textContent = basketModel.hasItem(item.id)
      ? "Удалить из корзины"
      : "В корзину";
  }

  modal.content = card.render(item);
  modal.open();
});

events.on("cart:changed", () => {
  header.counter = basketModel.getCount();
});

events.on("header:open-basket", () => {
  const basketItemsArray = basketModel.getItems().map((item, index) => {
    const itemElement = document.querySelector("#card-basket")
      ? ((
          (
            document.querySelector("#card-basket") as HTMLTemplateElement
          ).content.querySelector(".card") as HTMLElement
        ).cloneNode(true) as HTMLElement)
      : document.createElement("div");

    const basketItem = new BasketItem(itemElement, {
      onClick: () => {
        basketModel.removeItem(item);
        events.emit("header:open-basket");
      },
    });

    basketItem.index = index + 1;
    return basketItem.render(item);
  });

  basketView.items = basketItemsArray;
  basketView.total = basketModel.getTotal();

  modal.content = basketView.render();
  modal.open();
});

events.on("basket:open-order", () => {
  modal.content = orderForm.render(buyerModel.getData());

  const errors = buyerModel.validate();
  orderForm.valid = !errors.address && !errors.payment;
  orderForm.errors = [errors.address, errors.payment].filter(
    Boolean,
  ) as string[];

  modal.open();
});

events.on("order:payment-changed", (data: { payment: "online" | "cash" }) => {
  buyerModel.setData({ payment: data.payment });
});

events.on("order:address-changed", (data: { value: string }) => {
  buyerModel.setData({ address: data.value });
});

events.on("contacts:email-changed", (data: { value: string }) => {
  buyerModel.setData({ email: data.value });
});

events.on("contacts:phone-changed", (data: { value: string }) => {
  buyerModel.setData({ phone: data.value });
});

events.on("buyer:changed", () => {
  const errors = buyerModel.validate();

  const hasOrderErrors = !!errors.address || !!errors.payment;
  orderForm.valid = !hasOrderErrors;
  orderForm.errors = Object.values({
    address: errors.address,
    payment: errors.payment,
  }).filter(Boolean) as string[];

  const hasContactsErrors = !!errors.email || !!errors.phone;
  contactsForm.valid = !hasContactsErrors;
  contactsForm.errors = Object.values({
    email: errors.email,
    phone: errors.phone,
  }).filter(Boolean) as string[];
});

events.on("order:submit", () => {
  modal.content = contactsForm.render(buyerModel.getData());

  buyerModel.setData({});
});

// Финальная отправка заказа на сервер
events.on("contacts:submit", async () => {
  try {
    const totalCost = basketModel.getTotal();

    const orderData = {
      ...buyerModel.getData(),
      total: totalCost,
      items: basketModel.getItems().map((item) => item.id),
    } as IOrder;

    await webLarekApiInstance.createOrder(orderData);

    modal.content = successView.render({ total: totalCost });
    modal.open();

    basketModel.clear();
    buyerModel.clear();
    orderForm.clear();
    contactsForm.clear();
  } catch (error) {
    console.error("Ошибка при оформлении заказа:", error);
    contactsForm.errors = ["Не удалось отправить заказ. Попробуйте позже."];
  }
});

// 3. ПЕРВОНАЧАЛЬНЫЙ ЗАПУСК И ЗАГРУЗКА ДАННЫХ

(async () => {
  try {
    const productsResponse = await webLarekApiInstance.getProducts();
    productsModel.setItems(productsResponse.items);
  } catch (error) {
    console.error("Ошибка при получении товаров с сервера:", error);
  }
})();

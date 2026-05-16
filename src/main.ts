import "./scss/styles.scss";

import { Products } from "./components/Models/Products";
import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";

import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";

import { apiProducts } from "./utils/data";
import { AppApi } from "./components/AppApi";

const catalogInstance = new Products();
catalogInstance.setItems(apiProducts.items);
console.log("Массив товаров из каталога:", catalogInstance.getItems());

const testItemId = apiProducts.items[0].id;
const foundItem = catalogInstance.getItemById(testItemId);
console.log("Найденный товар по ID:", foundItem);

if (foundItem) {
  catalogInstance.setPreview(foundItem);
}

console.log(
  "Текущий товар для предварительного просмотра:",
  catalogInstance.getPreview(),
);

const basketInstance = new Basket();
const testProduct1 = apiProducts.items[0];
const testProduct2 = apiProducts.items[1];

basketInstance.addItem(testProduct1);
basketInstance.addItem(testProduct2);
console.log("Товары в корзине:", basketInstance.getItems());
console.log("Общая стоимость товаров в корзине:", basketInstance.getTotal());
console.log("Количество товаров в корзине:", basketInstance.getCount());
console.log(
  "Есть ли товар с ID в корзине:",
  basketInstance.hasItem(testItemId),
);

basketInstance.removeItem(testProduct1);
console.log("После удаления товара:", basketInstance.getItems());
console.log("Общая стоимость после удаления:", basketInstance.getTotal());

basketInstance.clear();
console.log("После очистки корзины:", basketInstance.getItems());

const buyerInstance = new Buyer();

buyerInstance.setData({
  payment: "online",
  email: "test@example.com",
  phone: "+7 (123) 456-78-90",
  address: "ул. Тестовая, д. 1",
});

console.log("Способ оплаты:", buyerInstance.getData().payment);
console.log("Email:", buyerInstance.getData().email);
console.log("Телефон:", buyerInstance.getData().phone);
console.log("Адрес:", buyerInstance.getData().address);
console.log("Данные покупателя:", buyerInstance.getData());
console.log("Валидация данных покупателя:", buyerInstance.validate());

buyerInstance.setData({
  email: "invalid-email",
});

console.log("Валидация с некорректным email:", buyerInstance.validate());

buyerInstance.setData({
  email: "test@example.com",
  phone: "no-digits",
});

console.log("Валидация с телефоном без цифр:", buyerInstance.validate());

console.log("=== Интеграция с сервером: получение товаров ===");

const apiInstance = new Api(API_URL);
const webLarekApiInstance = new AppApi(apiInstance);

(async () => {
  try {
    const productsResponse = await webLarekApiInstance.getProducts();

    catalogInstance.setItems(productsResponse.items);

    console.log(
      "Каталог товаров из сервера:",
      catalogInstance.getItems()
    );
  } catch (error) {
    console.error(
      "Ошибка при получении товаров с сервера:",
      error
    );
  }
})();
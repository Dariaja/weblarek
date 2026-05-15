import "./scss/styles.scss";

import { Catalog } from "./components/base/Models/Catalog";
import { Basket } from "./components/base/Models/Basket";
import { Buyer } from "./components/base/Models/Buyer";

import { WebLarekApi } from "./components/base/WebLarekApi";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";

import { apiProducts } from "./utils/data";

const catalogInstance = new Catalog();
catalogInstance.setItems(apiProducts.items);
console.log("Массив товаров из каталога:", catalogInstance.getItems());

const testItemId = apiProducts.items[0].id;
const foundItem = catalogInstance.getItem(testItemId);
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
buyerInstance.setPayment("online");
buyerInstance.setEmail("test@example.com");
buyerInstance.setPhone("+7 (123) 456-78-90");
buyerInstance.setAddress("ул. Тестовая, д. 1");

console.log("Способ оплаты:", buyerInstance.getPayment());
console.log("Email:", buyerInstance.getEmail());
console.log("Телефон:", buyerInstance.getPhone());
console.log("Адрес:", buyerInstance.getAddress());
console.log("Данные покупателя:", buyerInstance.getBuyerData());
console.log("Валидация данных покупателя:", buyerInstance.validate());

buyerInstance.setEmail("invalid-email");
console.log("Валидация с некорректным email:", buyerInstance.validate());

buyerInstance.setEmail("test@example.com"); // Вернем корректный email
buyerInstance.setPhone("no-digits");
console.log("Валидация с телефоном без цифр:", buyerInstance.validate());

console.log("=== Интеграция с сервером: получение товаров ===");
const apiInstance = new Api(API_URL); // Создаем экземпляр Api с базовым URL
const webLarekApiInstance = new WebLarekApi(apiInstance); // Создаем экземпляр WebLarekApi

(async () => {
  try {
    const products = await webLarekApiInstance.getProducts(); // Запрос товаров с сервера
    catalogInstance.setItems(products);
    console.log("Каталог товаров из сервера:", catalogInstance.getItems()); // Выводим в консоль
  } catch (error) {
    console.error("Ошибка при получении товаров с сервера:", error);
  }
})();

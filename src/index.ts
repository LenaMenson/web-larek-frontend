import './scss/styles.scss';

import {LarekApi} from "./components/LarekApi";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {Card, CardInBasket} from "./components/Card";
import {AppState, CatalogChangeEvent, ProductItem} from "./components/AppData";
import {Page} from "./components/Page";

import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {Basket} from "./components/common/Basket";

import {IOrderForm, IOrderLot, IOrder, FormErrors, IProductItem} from "./types/index";

//import {Card, CardInBasket} from "./components/Card";

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны 
const catalogItemTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const modalTemplate = ensureElement<HTMLTemplateElement>('#modal-container');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);

const modal = new Modal(modalTemplate,	events);


// Переиспользуемые части интерфейса

const basket = new Basket(cloneTemplate(basketTemplate), events);
/*
const order = new OrderForm(cloneTemplate<HTMLFormElement>(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate<HTMLFormElement>(contactsTemplate),	events);

*/
// Изменились элементы каталога
events.on<CatalogChangeEvent>('catalog:changed', () => {
	console.log('установка каталога - ON')
	page.catalog = appData.catalog.map((item: ProductItem) => {
		const card = new Card(cloneTemplate(catalogItemTemplate), {
			onClick: () => events.emit('card:select', item)
		});
		return card.render({
		  image: item.image,
		  title: item.title,
		  category: item.category,
		  price: item.price,
		  description: item.description,
		});
		
	});
  
	
  });

// Получаем каталог карточек товаров с сервера
api.getCardList()
  .then(appData.setCatalog.bind(appData))
  .catch(err => {
      console.error(err);
  });
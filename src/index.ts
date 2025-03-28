import './scss/styles.scss';
import {LarekApi} from "./components/LarekApi";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState, CatalogChangeEvent, ProductItem} from "./components/AppData";
import {Page} from "./components/Page";
import {Card, CardInBasket} from "./components/Card";
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {Basket} from "./components/common/Basket";
import {IOrderForm, IOrderLot, IOrder, FormErrors, IProductItem} from "./types/index";
import {OrderForm, ContactsForm} from "./components/Order";
import {Success} from "./components/common/Success";

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
const myBasket = new Basket(cloneTemplate<HTMLTemplateElement>(basketTemplate), events);
const order = new OrderForm(cloneTemplate<HTMLFormElement>(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate<HTMLFormElement>(contactsTemplate),	events);

// Изменились элементы каталога
events.on<CatalogChangeEvent>('catalog:changed', () => {
	page.catalog = appData.catalog.map((item: ProductItem) => {
		//создание экземпляра карточки товара
		const card = new Card(cloneTemplate(catalogItemTemplate), {
			//установка подписки на событие выбора карточки товара при клике на нее
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

  // Открытие превью карточки
events.on('card:select', (item: ProductItem) => {
	appData.setPreview(item);
  });
  
  // Изменена открытая выбранная карточка
events.on('preview:change', (item: ProductItem) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			//проверка добавлена ли уже карточка в корзину
			if (!appData.isInBasket(item)) {
				//установка подписки на событие добавления товара в корзину, если товар еще не в корзине
				events.emit('cardBasket:add', item);
			} else {
				//установка подписки на событие удаления товара из корзины, если товар уже в корзине
				events.emit('cardBasket:delete', item);
			}
		},
	});
	  
	modal.render({ 
		content: card.render(item) 
	})
  });
  
// Открытие корзины
events.on('basket:open', () => {
	  modal.render({
		  content: myBasket.render()
	  });
  });

// Обработка изменений содержимого корзины
events.on('basket:changed', () => {
	//установка кол-ва товаров на значке корзины
	page.counter = appData.getBasketVolume();
		myBasket.items = appData.basketItems.map((id, index) => {
			//определение элемента помещенного в корзину по id
			const basketItem = appData.catalog.find(item => item.id === id);
			//создание экземпляра карточки товара в корзине
			const basketCard = new CardInBasket(cloneTemplate(basketItemTemplate), {
				onClick: () => {
					//добавление функции удаления элемента из корзины
					appData.deleteFromBasket(basketItem);
				},
			});
		// нумерация в корзине
		basketItem.index = index +1;
	
		return basketCard.render({
			title: basketItem.title,
			price: basketItem.price,
			index: basketItem.index,
		});	
	})
	// установка суммы в корзине
	myBasket.total = appData.getTotal();
});
 
 // Добавление товара в корзину
  events.on('cardBasket:add', (item: ProductItem) => {
	appData.addToBasket(item); 
	modal.close();
  });
  
  // Удаление товара из корзины
  events.on('cardBasket:delete', (item: ProductItem) => {
	appData.deleteFromBasket(item);
  }); 
  
  // Слушатель открытия формы заказа (способ оплаты + адрес доставки)
  events.on('order:open', () => {
	  modal.render({
		  content: order.render({
			  payment: 'card',
			  address: '',
			  valid: false,
			  errors: [],
		  }),
	  });
  });
  
  // Слушатель изменений адреса доставки
  events.on('order.address:change', (data: { field: keyof IOrder; value: string }) => {
	  appData.setOrderField(data.field, data.value);
  });
  
  // Слушатель изменений выбора способа оплаты
  events.on('payment:changed', (data: { field: keyof IOrder; value: string }) => {
	  appData.setOrderField(data.field, data.value);
  });
  
  // Слушатель изменений ошибок валидации формы с адресом и способом оплаты
  events.on('orderFormErrors:change', (errors: FormErrors) => {
	  const { payment, address } = errors;
	  order.valid = !payment && !address;
	  order.errors = Object.values({ payment, address })
		  .filter((i) => !!i)
		  .join(', ');
  });
  
  // Слушатель открытия формы контактов 
  events.on('order:submit', () => {
	  modal.render({
		  content: contacts.render({
			  phone: '',
			  email: '',
			  valid: false,
			  errors: [],
		  }),
	  });
  });

  // Слушатели изменений полей формы контактов 
  events.on('contacts.phone:change', (data: { field: keyof IOrder; value: string }) => {
	  appData.setContactsField(data.field, data.value);
  });
  events.on('contacts.email:change', (data: { field: keyof IOrder; value: string }) => {
	  appData.setContactsField(data.field, data.value);
  });
  
  // Слушатель изменений ошибок валидации формы с адресом и способом оплаты
  events.on('contactsFormErrors:change', (errors: FormErrors) => {
	  const { phone, email } = errors;
	  contacts.valid = !phone && !email;
	  contacts.errors = Object.values({ phone, email })
		  .filter((i) => !!i)
		  .join(', ');
  });
  
  // Отправлена форма заказа
  events.on('contacts:submit', () => {
	//сохранение данных заказа в переменную
	const orderData = appData.getOrder();
	//отправка заказа на север
	  api.postOrderLot(orderData)
		  .then(() => {
			//открытие модального окна успешно сделанного заказа
			  const success = new Success(cloneTemplate(successTemplate), {
					  onClick: () => {
						  modal.close();  
					  },
				  },	 
			  );
			  modal.render({ 
				content: success.render() 
			});
			  //установка списанной суммы модального окна успешно сделанного заказа
			  success.totalSuccess = appData.basketTotal;
		  })
		  .then(() => {
			appData.clearBasket();
			events.emit('basket:changed');
		})
		.catch(err => {
			console.error(err);
		});
  });
  
  // Блокируем прокрутку страницы если открыта модалка
  events.on('modal:open', () => {
	page.locked = true;
  });
  
  // ... и разблокируем
  events.on('modal:close', () => {
	page.locked = false;
  });


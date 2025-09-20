import { Ingredients } from './ingredients';

// Заказ с полным набором ингредиентов
export const completedOrder = {
  _id: 'order-completed-001',
  status: 'done',
  name: 'Галактический бургер с экзо-начинкой',
  createdAt: '2025-09-20T20:57:45.554Z',
  updatedAt: '2025-09-20T20:57:45.554Z',
  number: 123456,
  ingredients: [
    Ingredients.bun.fluorescentBun._id,
    Ingredients.sauce.firmSauce._id,
    Ingredients.main.etherealMeat._id,
    Ingredients.bun.fluorescentBun._id
  ]
};

// Минимальный заказ с одним ингредиентом
export const minimalOrder = {
  _id: 'order-minimal-002',
  status: 'done',
  name: 'Базовый соусный бургер',
  createdAt: '2025-07-01T21:51:45.554Z',
  updatedAt: '2025-07-01T21:51:46.400Z',
  number: 666666,
  ingredients: [Ingredients.sauce.spicySauce._id]
};

// Массив всех тестовых заказов
export const testOrders = [completedOrder, minimalOrder];

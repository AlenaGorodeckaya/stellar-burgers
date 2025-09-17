import { configureStore, combineSlices } from '@reduxjs/toolkit';

import {
  //TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { constructorSlice } from '../slices/constructorSlice';
import { feedSlice } from '../slices/feedSlice';
import { ingredientsSlice } from '../slices/ingredientsSlice';
import { orderDetailsSlice } from '../slices/orderDetailsSlice';
import { orderSlice } from '../slices/orderSlice';
import { userSlice } from '../slices/userSlice';

// Создание единого состояния приложения из нескольких слайсов
const rootReducer = combineSlices({
  creator: constructorSlice.reducer, // Конструктор бургера: булки, начинки, порядок ингредиентов
  feed: feedSlice.reducer, // Лента заказов (реальное время)
  ingredients: ingredientsSlice.reducer, // Список всех доступных ингредиентов с сервера
  orderDetails: orderDetailsSlice.reducer, // Детали конкретного заказа для модального окна
  order: orderSlice.reducer, // Текущий создаваемый заказ и его статус
  user: userSlice.reducer // Состояние пользователя=
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = dispatchHook.withTypes<AppDispatch>();
export const useAppSelector = selectorHook.withTypes<RootState>();

export default store;

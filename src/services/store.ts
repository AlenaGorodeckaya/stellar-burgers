import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import appReducer from './createSlice/appReducer';
import authReducer from './createSlice/authReducer';
import constructorReducer from './createSlice/constructorReducer';
import feedReducer from './createSlice/feedReducer';
import { ingredientsReducer } from './createSlice/ingredientsReducer';
import { userOrdersReducer } from './createSlice/userReducer';

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  user: userOrdersReducer,
  feed: feedReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;

//Готово

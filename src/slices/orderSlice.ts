// Текущий заказ
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

// Асинхронное для создания заказа
export const performOrder = createAsyncThunk(
  'order/performOrder',
  async (ingredients: string[]) => orderBurgerApi(ingredients)
);

// Интерфейс состояния заказа
export interface OrderState {
  isOrderConfirmed: boolean;
  isOrderRequested: boolean;
  completed: TOrder | null;
}

// Начальное состояние
const initialState: OrderState = {
  isOrderConfirmed: false,
  isOrderRequested: false,
  completed: null
};

// Слайс для управления состоянием заказа
export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    confirmOrder: (state) => {
      state.isOrderConfirmed = true;
    },
    clearOrder: (state) => {
      state.isOrderConfirmed = false;
      state.completed = null;
    }
  },
  // Селекторы для получения данных из состояния
  selectors: {
    selectOrderConfirmed: (state) => state.isOrderConfirmed,
    selectOrderRequested: (state) => state.isOrderRequested,
    selectOrderCompleted: (state) => state.completed
  },
  // Обработка асинхронных действий
  extraReducers: (builder) => {
    builder
      // Обработка начала выполнения заказа
      .addCase(performOrder.pending, (state) => {
        state.isOrderRequested = true;
        state.isOrderConfirmed = false;
      })
      // Обработка ошибки при выполнении заказа
      .addCase(performOrder.rejected, (state) => {
        state.isOrderRequested = false;
      })
      // Обработка успешного выполнения заказа
      .addCase(performOrder.fulfilled, (state, action) => {
        state.isOrderRequested = false;
        state.completed = action.payload.order;
      });
  }
});

export const { confirmOrder, clearOrder } = orderSlice.actions;

export const {
  selectOrderConfirmed,
  selectOrderRequested,
  selectOrderCompleted
} = orderSlice.selectors;

export default orderSlice.reducer;

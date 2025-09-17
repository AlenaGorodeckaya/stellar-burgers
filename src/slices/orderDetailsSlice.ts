// Детали заказа (модальное окно)
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

// Асинхронное для получения заказа по номеру
export const fetchOrderByNumber = createAsyncThunk(
  'orderDetails/fetchOrderByNumber',
  async (number: number) => getOrderByNumberApi(number)
);

//Интерфейс состояния деталей заказа
export interface OrderDetailsState {
  isLoading: boolean;
  order: TOrder | null;
  error: string | null;
}

// Начальное состояние
const initialState: OrderDetailsState = {
  isLoading: false,
  order: null,
  error: null
};

// Управление состоянием деталей заказа
export const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    // Действие для очистки данных заказа
    clearOrder: (state) => {
      state.order = null;
      state.error = null;
    }
  },
  selectors: {
    // Селектор для получения данных заказа
    selectOrderDetails: (state) => state.order,

    //Селектор для получения статуса загрузки
    selectOrderDetailsLoading: (state) => state.isLoading,

    // Селектор для получения ошибки
    selectOrderDetailsError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      // Обработка начала загрузки
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Обработка неудачной загрузки
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        // Сохраняем сообщение об ошибке или стандартное сообщение
        state.error = action.error.message || 'Ошибка';
      })
      // Обработка успешной загрузки
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload.orders[0];
      });
  }
});

export const { clearOrder } = orderDetailsSlice.actions;

export const {
  selectOrderDetails,
  selectOrderDetailsLoading,
  selectOrderDetailsError
} = orderDetailsSlice.selectors;

export default orderDetailsSlice.reducer;

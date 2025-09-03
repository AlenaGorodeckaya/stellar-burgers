// Лента заказов
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

// Асинхронный для получения ленты заказов
export const fetchFeeds = createAsyncThunk('feeds/fetchAll', getFeedsApi);

// Интерфейс состояния ленты заказов
export interface FeedState {
  isLoading: boolean;
  orders: TOrder[] | null; // Массив заказов
  total: number | null; // Общее количество заказов
  totalToday: number | null; // Количество заказов за сегодня
  error: string | null;
}

// Начальное состояние стора
const initialState: FeedState = {
  isLoading: false,
  orders: null,
  total: null,
  totalToday: null,
  error: null
};

// Создание slice для управления состоянием ленты заказов
export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearFeedError: (state) => {
      state.error = null;
    }
  },
  // Селекторы для доступа к данным
  selectors: {
    selectFeedLoading: (state) => state.isLoading,
    selectFeedOrders: (state) => state.orders,
    selectFeedTotal: (state) => state.total,
    selectFeedTotalToday: (state) => state.totalToday
  },
  // Обработка асинхронных actions
  extraReducers: (builder) => {
    builder
      // Обработка начала загрузки
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Обработка ошибки загрузки
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Не удалось загрузить ленту заказов';
      })
      // Обработка успешной загрузки
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        if (action.payload.success) {
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        } else {
          state.error = 'Ошибка: API';
        }
      });
  }
});

export const {
  selectFeedLoading,
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday
} = feedSlice.selectors;

// Экспорт reducer по умолчанию
export default feedSlice.reducer;

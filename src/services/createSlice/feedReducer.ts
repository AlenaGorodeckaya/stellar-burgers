import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrderByNumberApi,
  TFeedsResponse,
  TOrderResponse
} from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

// Состояние слайса для ленты заказов
type TFeedState = {
  isLoading: boolean; // Флаг загрузки данных
  feeds: TOrder[]; // Список всех заказов в ленте
  total: number; // Общее количество заказов
  totalToday: number; // Количество заказов за сегодня
  currentOrder: TOrder | null; // Текущий выбранный заказ
  selectedOrders: TOrder[]; // Vассив для хранения выбранных заказов
};

// Начальное состояние
const initialState: TFeedState = {
  isLoading: false,
  feeds: [],
  total: 0,
  totalToday: 0,
  currentOrder: null,
  selectedOrders: []
};

// для загрузки ленты заказов
export const fetchFeeds = createAsyncThunk<
  TFeedsResponse,
  void,
  { state: RootState }
>('feed/fetchAll', async (): Promise<TFeedsResponse> => getFeedsApi());

// для загрузки заказа по ID
export const fetchOrderById = createAsyncThunk<
  TOrderResponse,
  number,
  { state: RootState }
>(
  'feed/fetchById',
  async (orderId: number): Promise<TOrderResponse> =>
    getOrderByNumberApi(orderId)
);

// Слайс для работы с лентой заказов
const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {},
  extraReducers: (builder) => {
    builder
      // Обработка загрузки ленты заказов
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchFeeds.fulfilled,
        (state, action: PayloadAction<TFeedsResponse>) => {
          state.isLoading = false;
          state.feeds = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(fetchFeeds.rejected, (state) => {
        state.isLoading = false;
      })

      // Обработка загрузки конкретного заказа
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
      })
      // Сохраняем как текущий заказ
      .addCase(
        fetchOrderById.fulfilled,
        (state, action: PayloadAction<TOrderResponse>) => {
          state.isLoading = false;
          state.currentOrder = action.payload.orders[0];
          state.selectedOrders = action.payload.orders; // сохранение всех заказов
        }
      )
      .addCase(fetchOrderById.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export default feedSlice.reducer;

// готово

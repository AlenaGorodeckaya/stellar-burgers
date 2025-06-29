import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, RequestState } from '@utils-types';

export interface IUserOrdersState {
  orders: TOrder[];
  currentOrder: TOrder | null;
  requestState: RequestState;
  error: string | null;
}

const initialOrderData: TOrder = {
  _id: '',
  status: '',
  name: '',
  createdAt: '',
  updatedAt: '',
  number: 0,
  ingredients: []
};

const initialState: IUserOrdersState = {
  orders: [],
  currentOrder: null,
  requestState: RequestState.IDLE,
  error: null
};

export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    setCurrentOrder: (state, action: PayloadAction<TOrder>) => {
      state.currentOrder = action.payload;
    },
    resetCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.error = null;
      state.requestState = RequestState.IDLE;
    },
    resetOrderData: (state) => {
      state.currentOrder = initialOrderData;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.requestState = RequestState.LOADING;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.requestState = RequestState.FAILED;
        state.error = action.payload as string;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.requestState = RequestState.SUCCESS;
          state.orders = action.payload;
          state.currentOrder = action.payload[0] || null;
        }
      );
  }
});

export const {
  setCurrentOrder,
  resetCurrentOrder,
  clearOrders,
  resetOrderData
} = userOrdersSlice.actions;

export const userOrdersReducer = userOrdersSlice.reducer;

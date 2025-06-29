import {
  createAsyncThunk,
  createSlice,
  createSelector,
  PayloadAction
} from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';
import { orderBurgerApi, TNewOrderResponse } from '@api';
import { RootState } from '../store';

interface ConstructorIngredients {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

interface BurgerConstructorState {
  ingredients: ConstructorIngredients;
  isOrderLoading: boolean;
  orderDetails: TOrder | null;
}

const initialState: BurgerConstructorState = {
  ingredients: {
    bun: null,
    ingredients: []
  },
  isOrderLoading: false,
  orderDetails: null
};

export const createOrder = createAsyncThunk<
  TNewOrderResponse,
  string[],
  { state: RootState }
>('burgerConstructor/createOrder', (ingredientsIds) =>
  orderBurgerApi(ingredientsIds)
);

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Добавление ингредиента в конструктор
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        state.ingredients.bun = ingredient;
      } else {
        state.ingredients.ingredients.push(ingredient);
      }
    },
    // Удаление ингредиента из конструктора
    removeIngredient: (state, action: PayloadAction<{ id: string }>) => {
      state.ingredients.ingredients = state.ingredients.ingredients.filter(
        (item) => item.id !== action.payload.id
      );
    },
    // Сброс данных заказа
    resetOrder: (state) => {
      state.orderDetails = null;
      state.isOrderLoading = false;
    },
    // Перемещение ингредиента вверх/вниз
    moveIngredient: (
      state,
      action: PayloadAction<{ id: string; direction: 'up' | 'down' }>
    ) => {
      const { id, direction } = action.payload;
      const items = state.ingredients.ingredients;
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= items.length) return;

      [items[index], items[newIndex]] = [items[newIndex], items[index]];
    },
    // Очистка всего конструктора
    clearConstructor: (state) => {
      state.ingredients = { bun: null, ingredients: [] };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isOrderLoading = true;
      })
      .addCase(createOrder.rejected, (state) => {
        state.isOrderLoading = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isOrderLoading = false;
          state.orderDetails = action.payload.order;
          state.ingredients = { bun: null, ingredients: [] };
        }
      });
  }
});

// Селекторы
const selectBurgerConstructorState = (state: RootState) =>
  state.burgerConstructor;

export const selectConstructorItems = createSelector(
  [selectBurgerConstructorState],
  (burgerConstructor) => burgerConstructor.ingredients
);

export const selectOrderRequest = createSelector(
  [selectBurgerConstructorState],
  (burgerConstructor) => burgerConstructor.isOrderLoading
);

export const selectOrderModalData = createSelector(
  [selectBurgerConstructorState],
  (burgerConstructor) => burgerConstructor.orderDetails
);

export const selectConstructorPrice = createSelector(
  [selectConstructorItems],
  (items) =>
    (items.bun ? items.bun.price * 2 : 0) +
    items.ingredients.reduce((sum, item) => sum + item.price, 0)
);

export const {
  addIngredient,
  removeIngredient,
  resetOrder,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;

// готово

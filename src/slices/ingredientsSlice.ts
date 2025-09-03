// Список ингредиентов
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

// Асинхронный для получения ингредиентов
export const fetchIngredients = createAsyncThunk(
  'ingredients/getAll',
  async () => getIngredientsApi()
);

export interface IngredientsSliceState {
  isLoading: boolean;
  ingredients: TIngredient[] | null;
}

const initialState: IngredientsSliceState = {
  isLoading: true,
  ingredients: null
};

// Создание slice
export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    // Селектор загрузки
    selectIngredientsLoading: (state) => state.isLoading,

    // Все ингредиенты
    selectIngredients: (state) => state.ingredients,

    // Булочки для бургеров
    selectBuns: (state) =>
      state.ingredients
        ? state.ingredients.filter(
            (ingredient: TIngredient) => ingredient.type === 'bun'
          )
        : [],

    // Основные ингредиенты
    selectMains: (state) =>
      state.ingredients
        ? state.ingredients.filter(
            (ingredient: TIngredient) => ingredient.type === 'main'
          )
        : [],

    // Соусы
    selectSauces: (state) =>
      state.ingredients
        ? state.ingredients.filter(
            (ingredient: TIngredient) => ingredient.type === 'sauce'
          )
        : [],

    // Поиск ингредиента по ID
    selectIngredientById: (state) => (id: string) =>
      state.ingredients?.find(
        (ingredient: TIngredient) => ingredient._id === id
      )
  },

  // Обработка асинхронных действий
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.isLoading = false;
        state.ingredients = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      });
  }
});

export const {
  selectIngredientsLoading,
  selectIngredients,
  selectBuns,
  selectMains,
  selectSauces,
  selectIngredientById
} = ingredientsSlice.selectors;

export default ingredientsSlice.reducer;

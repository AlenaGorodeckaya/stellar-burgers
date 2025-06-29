import {
  createAsyncThunk,
  createSlice,
  createSelector,
  PayloadAction
} from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient, TTabMode } from '@utils-types';
import { RootState } from '../store';

// Тип состояния для ингредиентов
export type TIngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
  selectedIngredient: TIngredient | null;
  // Добавляем типизированные группы ингредиентов
  bun: TIngredient[];
  sauce: TIngredient[];
  main: TIngredient[];
};

const initialState: TIngredientsState = {
  items: [],
  isLoading: false,
  error: null,
  selectedIngredient: null,
  // Инициализируем группы
  bun: [],
  sauce: [],
  main: []
};

// Асинхронный thunk для загрузки ингредиентов
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await getIngredientsApi();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    // Очистка ошибок
    clearError: (state) => {
      state.error = null;
    },
    // Выбор конкретного ингредиента
    selectIngredient: (state, action: PayloadAction<string>) => {
      state.selectedIngredient =
        state.items.find((item) => item._id === action.payload) ?? null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items = action.payload;

        // Группируем ингредиенты по типам (добавлено из второго кода)
        const data: Record<TTabMode, TIngredient[]> = {
          bun: [],
          sauce: [],
          main: []
        };

        action.payload.forEach((item) => {
          if (item?.type && item.type in data) {
            const itemType = item.type as TTabMode;
            data[itemType].push(item);
          }
        });

        // Обновляем группы в состоянии
        state.bun = data.bun;
        state.sauce = data.sauce;
        state.main = data.main;
      });
  }
});

// Селекторы
const selectIngredientsState = (state: RootState) => state.ingredients;

export const selectIngredients = createSelector(
  [selectIngredientsState],
  (ingredients) => ingredients.items
);

// Селектор для получения ингредиентов по типу (оптимизированная версия)
export const selectIngredientsByType = (type: TTabMode) =>
  createSelector([selectIngredientsState], (ingredients) => {
    switch (type) {
      case 'bun':
        return ingredients.bun;
      case 'sauce':
        return ingredients.sauce;
      case 'main':
        return ingredients.main;
      default:
        return [];
    }
  });

export const selectIsLoading = createSelector(
  [selectIngredientsState],
  (ingredients) => ingredients.isLoading
);

export const selectError = createSelector(
  [selectIngredientsState],
  (ingredients) => ingredients.error
);

export const selectIngredientById = (id: string) =>
  createSelector([selectIngredients], (ingredients) =>
    ingredients.find((item) => item._id === id)
  );

export const selectSelectedIngredient = createSelector(
  [selectIngredientsState],
  (ingredients) => ingredients.selectedIngredient
);

export const { clearError, selectIngredient } = ingredientsSlice.actions;
export const ingredientsReducer = ingredientsSlice.reducer;

// готово

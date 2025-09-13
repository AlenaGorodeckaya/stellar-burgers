// Конструктор бургера (перетаскивание ингредиентов)
import { PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { RootState } from '../services/store';
import { performOrder } from './orderSlice';

// Интерфейс конструктора бургера
export interface BurgerConstructorState {
  bun: TConstructorIngredient | null; // Выбранная булочка
  ingredients: TConstructorIngredient[]; // Все кроме булки
}

// Начальное состояние
const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: []
};

// Управление состоянием
export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    // Добавление ингредиента в конструктор
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;

        if (ingredient.type === 'bun') {
          return {
            ...state,
            bun: ingredient
          };
        } else {
          if (!state.ingredients) {
            state.ingredients = [];
          }
          state.ingredients.push(ingredient);
        }
      },
      // Уникальный ID к ингредиенту
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },

    // Ингредиент по списку вниз
    moveIngredientDown: (state, action: PayloadAction<string>) => {
      const index = state.ingredients.findIndex(
        (item) => item.id === action.payload
      );
      // Меняем местами со следующим элементом, если это не последний элемент
      if (index >= 0 && index < state.ingredients.length - 1) {
        [state.ingredients[index], state.ingredients[index + 1]] = [
          state.ingredients[index + 1],
          state.ingredients[index]
        ];
      }
    },

    // Вверх
    moveIngredientUp: (state, action: PayloadAction<string>) => {
      const index = state.ingredients.findIndex(
        (item) => item.id === action.payload
      );
      // Меняем местами с предыдущим элементом, если это не первый элемент
      if (index > 0) {
        [state.ingredients[index], state.ingredients[index - 1]] = [
          state.ingredients[index - 1],
          state.ingredients[index]
        ];
      }
    },

    // Удаляем чего-нибудь
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },

    // Всееее удаляем
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },

  // Добавляем обработку успешного создания заказа
  extraReducers: (builder) => {
    builder.addCase(performOrder.fulfilled, (state) => {
      state.bun = null;
      state.ingredients = [];
    });
  }
});

export const selectConstructorBun = (state: RootState) => state.creator.bun; // Тек. булочка
export const selectConstructorIngredients = (state: RootState) =>
  state.creator.ingredients; // Список ингредиентов

export const {
  addIngredient,
  moveIngredientUp,
  moveIngredientDown,
  removeIngredient,
  clearConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;

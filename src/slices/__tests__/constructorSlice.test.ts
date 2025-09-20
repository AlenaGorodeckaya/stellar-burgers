import { constructorSlice } from '../constructorSlice';
import { TIngredient } from '../../utils/types';
import { performOrder } from '../orderSlice';

const mockIngredient: TIngredient = {
  _id: 'test_id',
  name: 'Test Ingredient',
  type: 'main',
  proteins: 10,
  fat: 5,
  carbohydrates: 15,
  calories: 100,
  price: 50,
  image: 'test.jpg',
  image_large: 'test_large.jpg',
  image_mobile: 'test_mobile.jpg'
};

const mockBun: TIngredient = {
  _id: 'bun_id',
  name: 'Test Bun',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 15,
  calories: 100,
  price: 50,
  image: 'bun.jpg',
  image_large: 'bun_large.jpg',
  image_mobile: 'bun_mobile.jpg'
};

describe('Тест constructorSlice', () => {
  // Тест 1: Добавление ингредиента в конструктор
  it('Должен добавить ингредиент в конструктор', () => {
    const action = constructorSlice.actions.addIngredient(mockIngredient);
    const state = constructorSlice.reducer(undefined, action);

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject({
      ...mockIngredient,
      id: expect.any(String)
    });
  });

  // Тест 2: Добавление булки в конструктор
  it('Должен заменить булку при добавлении новой', () => {
    const firstAction = constructorSlice.actions.addIngredient(mockBun);
    const firstState = constructorSlice.reducer(undefined, firstAction);

    const newBun = { ...mockBun, _id: 'new_bun_id' };
    const secondAction = constructorSlice.actions.addIngredient(newBun);
    const secondState = constructorSlice.reducer(firstState, secondAction);

    expect(secondState.bun).toMatchObject({
      ...newBun,
      id: expect.any(String)
    });
    expect(secondState.ingredients).toHaveLength(0);
  });

  // Тест 3: Удаление ингредиента из конструктора
  it('Должен удалить ингредиент из конструктора', () => {
    const initialState = {
      bun: null,
      ingredients: [{ ...mockIngredient, id: 'test_id' }]
    };

    const action = constructorSlice.actions.removeIngredient('test_id');
    const state = constructorSlice.reducer(initialState, action);

    expect(state.ingredients).toHaveLength(0);
  });

  // Тест 4: Перемещение ингредиента вверх
  it('Должен переместить ингредиент вверх по списку', () => {
    const ingredients = [
      { ...mockIngredient, id: 'first' },
      { ...mockIngredient, id: 'second' },
      { ...mockIngredient, id: 'third' }
    ];
    const initialState = {
      bun: null,
      ingredients
    };

    const action = constructorSlice.actions.moveIngredientUp('second');
    const state = constructorSlice.reducer(initialState, action);

    expect(state.ingredients[0].id).toBe('second');
    expect(state.ingredients[1].id).toBe('first');
    expect(state.ingredients[2].id).toBe('third');
  });

  // Тест 5: Перемещение ингредиента вниз
  it('Должен переместить ингредиент вниз по списку', () => {
    const ingredients = [
      { ...mockIngredient, id: 'first' },
      { ...mockIngredient, id: 'second' },
      { ...mockIngredient, id: 'third' }
    ];
    const initialState = {
      bun: null,
      ingredients
    };

    const action = constructorSlice.actions.moveIngredientDown('second');
    const state = constructorSlice.reducer(initialState, action);

    expect(state.ingredients[0].id).toBe('first');
    expect(state.ingredients[1].id).toBe('third');
    expect(state.ingredients[2].id).toBe('second');
  });

  // Тест 6: Очистка конструктора
  it('Должен очистить весь конструктор', () => {
    const initialState = {
      bun: { ...mockBun, id: 'bun_id' },
      ingredients: [{ ...mockIngredient, id: 'test_id' }]
    };

    const action = constructorSlice.actions.clearConstructor();
    const state = constructorSlice.reducer(initialState, action);

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });

  // Тест 7: Очистка после успешного заказа
  it('Должен очистить конструктор после успешного заказа', () => {
    const initialState = {
      bun: { ...mockBun, id: 'bun_id' },
      ingredients: [{ ...mockIngredient, id: 'test_id' }]
    };

    const action = { type: performOrder.fulfilled.type };
    const state = constructorSlice.reducer(initialState, action);

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
});

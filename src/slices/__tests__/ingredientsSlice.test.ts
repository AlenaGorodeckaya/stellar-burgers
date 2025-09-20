import { ingredientsSlice, fetchIngredients } from '../ingredientsSlice';
import { TIngredient } from '../../utils/types';

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

describe('Тест ingredientsSlice асинхронных экшенов', () => {
  it('Должен установить isLoading=true при pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsSlice.reducer(undefined, action);
    
    expect(state.isLoading).toBe(true);
  });

  it('Должен обработать успешный запрос', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: [mockIngredient]
    };
    const state = ingredientsSlice.reducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual([mockIngredient]);
  });

  it('Должен обработать ошибку запроса', () => {
    const action = {
      type: fetchIngredients.rejected.type
    };
    const state = ingredientsSlice.reducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toBeNull();
  });
});

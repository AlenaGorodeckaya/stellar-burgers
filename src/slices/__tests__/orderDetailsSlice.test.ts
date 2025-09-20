import { orderDetailsSlice, fetchOrderByNumber } from '../orderDetailsSlice';
import { TOrder } from '../../utils/types';

const mockOrder: TOrder = {
  _id: 'test_id',
  status: 'done',
  name: 'Test Order',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  number: 1,
  ingredients: ['ing1', 'ing2']
};

describe('Тест orderDetailsSlice асинхронных экшенов', () => {
  it('Должен установить isLoading=true при pending', () => {
    const action = { type: fetchOrderByNumber.pending.type };
    const state = orderDetailsSlice.reducer(undefined, action);
    
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Должен обработать успешный запрос', () => {
    const action = {
      type: fetchOrderByNumber.fulfilled.type,
      payload: { orders: [mockOrder] }
    };
    const state = orderDetailsSlice.reducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.order).toEqual(mockOrder);
    expect(state.error).toBeNull();
  });

  it('Должен обработать ошибку запроса', () => {
    const action = {
      type: fetchOrderByNumber.rejected.type,
      error: { message: 'Ошибка загрузки' }
    };
    const state = orderDetailsSlice.reducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});

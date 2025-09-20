import { orderSlice, performOrder } from '../orderSlice';
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

describe('Тест orderSlice асинхронных экшенов', () => {
  it('Должен установить isOrderRequested=true при pending', () => {
    const action = { type: performOrder.pending.type };
    const state = orderSlice.reducer(undefined, action);
    
    expect(state.isOrderRequested).toBe(true);
    expect(state.isOrderConfirmed).toBe(false);
  });

  it('Должен обработать успешный запрос', () => {
    const action = {
      type: performOrder.fulfilled.type,
      payload: { order: mockOrder }
    };
    const state = orderSlice.reducer(undefined, action);

    expect(state.isOrderRequested).toBe(false);
    expect(state.completed).toEqual(mockOrder);
  });

  it('Должен обработать ошибку запроса', () => {
    const action = {
      type: performOrder.rejected.type
    };
    const state = orderSlice.reducer(undefined, action);

    expect(state.isOrderRequested).toBe(false);
  });
});

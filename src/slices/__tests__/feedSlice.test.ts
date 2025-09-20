import { feedSlice, fetchFeeds } from '../feedSlice';
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

describe('Тест feedSlice асинхронных экшенов', () => {
  it('Должен установить isLoading=true при pending', () => {
    const action = { type: fetchFeeds.pending.type };
    const state = feedSlice.reducer(undefined, action);
    
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Должен обработать успешный запрос', () => {
    const action = {
      type: fetchFeeds.fulfilled.type,
      payload: {
        success: true,
        orders: [mockOrder],
        total: 100,
        totalToday: 10
      }
    };
    const state = feedSlice.reducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual([mockOrder]);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(10);
  });

  it('Должен обработать ошибку запроса', () => {
    const action = {
      type: fetchFeeds.rejected.type,
      error: { message: 'Ошибка загрузки' }
    };
    const state = feedSlice.reducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});

import { rootReducer } from '../store';
import { UnknownAction } from '@reduxjs/toolkit';

describe('Тест rootReducer', () => {
  it('Должен вернуть начальное состояние при неизвестном экшене', () => {
    const action = { type: 'UNKNOWN_ACTION' } as UnknownAction;
    const state = rootReducer(undefined, action);

    expect(state).toEqual({
      creator: {
        bun: null,
        ingredients: []
      },
      feed: {
        isLoading: false,
        orders: null,
        total: null,
        totalToday: null,
        error: null
      },
      ingredients: {
        isLoading: true,
        ingredients: null
      },
      orderDetails: {
        isLoading: false,
        order: null,
        error: null
      },
      order: {
        isOrderConfirmed: false,
        isOrderRequested: false,
        completed: null
      },
      user: {
        isUserLoading: false,
        userData: null,
        userOrders: null,
        userError: null
      }
    });
  });
});

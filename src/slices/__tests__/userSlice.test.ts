import { userSlice, registerUser, logoutUser, resetUserPassword } from '../userSlice';
import { TUser, TOrder } from '../../utils/types';

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

const mockOrder: TOrder = {
  _id: 'test_id',
  status: 'done',
  name: 'Test Order',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  number: 1,
  ingredients: ['ing1', 'ing2']
};

const initialState = {
  isUserLoading: false,
  userData: null,
  userOrders: null,
  userError: null
};

describe('Тест userSlice асинхронных экшенов', () => {
  // ... существующие тесты ...

  it('Должен обработать успешную регистрацию пользователя', () => {
    const action = {
      type: registerUser.fulfilled.type,
      payload: { 
        success: true, 
        user: mockUser,
        accessToken: 'test_token',
        refreshToken: 'refresh_token'
      }
    };
    const state = userSlice.reducer(initialState, action);

    expect(state.isUserLoading).toBe(false);
    expect(state.userData).toEqual(mockUser);
    expect(state.userError).toBeNull();
  });

  it('Должен обработать ошибку регистрации пользователя', () => {
    const action = {
      type: registerUser.rejected.type,
      error: { message: 'Ошибка регистрации' }
    };
    const state = userSlice.reducer(initialState, action);

    expect(state.isUserLoading).toBe(false);
    expect(state.userError).toBe('Ошибка регистрации');
  });

  it('Должен обработать успешный выход пользователя', () => {
    const action = {
      type: logoutUser.fulfilled.type,
      payload: { success: true }
    };
    const state = userSlice.reducer(
      { ...initialState, userData: mockUser, userOrders: [mockOrder] }, 
      action
    );

    expect(state.userData).toBeNull();
    expect(state.userOrders).toBeNull();
    expect(state.userError).toBeNull();
  });

  it('Должен обработать ошибку выхода пользователя', () => {
    const action = {
      type: logoutUser.rejected.type,
      error: { message: 'Ошибка выхода' }
    };
    const state = userSlice.reducer(initialState, action);

    expect(state.userError).toBe('Ошибка выхода');
  });

  it('Должен обработать успешный сброс пароля', () => {
    const action = {
      type: resetUserPassword.fulfilled.type,
      payload: { success: true }
    };
    const state = userSlice.reducer(initialState, action);

    expect(state.isUserLoading).toBe(false);
    expect(state.userError).toBeNull();
  });

  it('Должен обработать ошибку сброса пароля', () => {
    const action = {
      type: resetUserPassword.rejected.type,
      error: { message: 'Ошибка сброса пароля' }
    };
    const state = userSlice.reducer(initialState, action);

    expect(state.isUserLoading).toBe(false);
    expect(state.userError).toBe('Ошибка сброса пароля');
  });

  it('Должен установить статус загрузки при запросе сброса пароля', () => {
    const action = { type: resetUserPassword.pending.type };
    const state = userSlice.reducer(initialState, action);

    expect(state.isUserLoading).toBe(true);
    expect(state.userError).toBeNull();
  });
});

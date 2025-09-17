// Аутентификация и данные пользователя
import { TUser, TOrder } from '@utils-types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { setCookie, deleteCookie } from '../utils/cookie';
import {
  registerUserApi,
  getUserApi,
  loginUserApi,
  resetPasswordApi,
  updateUserApi,
  getOrdersApi,
  logoutApi,
  TServerResponse,
  TRegisterData,
  TLoginData
} from '@api';

// Асинхронные действия пользователя (thunks)

// Регистрация нового пользователя
export const registerUser = createAsyncThunk(
  'user/register',
  async (userData: TRegisterData) => registerUserApi(userData).then(acceptAuth)
);

// Получение данных о текущем пользователе
export const fetchUserData = createAsyncThunk('user/fetchData', async () =>
  getUserApi()
);

// Аутентификация пользователя
export const loginUser = createAsyncThunk(
  'user/login',
  async (userCredentials: TLoginData) =>
    loginUserApi(userCredentials).then(acceptAuth)
);

// Получение списка заказов пользователя
export const fetchUserOrders = createAsyncThunk('user/fetchOrders', async () =>
  getOrdersApi()
);

// Обновление профиля пользователя
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData: Partial<TUser>) => updateUserApi(userData)
);

// Выход пользователя из системы
export const logoutUser = createAsyncThunk('user/logout', async () =>
  logoutApi().then(clearAuth)
);

// Сброс пароля пользователя
export const resetUserPassword = createAsyncThunk(
  'user/resetPassword',
  async (passwordData: { password: string; token: string }) =>
    resetPasswordApi(passwordData)
);

// Константы для ключей хранения токенов
const REFRESH_TOKEN_KEY = 'refreshToken';
const ACCESS_TOKEN_KEY = 'accessToken';

// Обработка аутентификации пользователя (*успех*)
function acceptAuth(
  data: TServerResponse<{
    refreshToken: string;
    accessToken: string;
    user: TUser;
  }>
) {
  if (data.success) {
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    setCookie(ACCESS_TOKEN_KEY, data.accessToken);
  }
  return data;
}

// Обработка выхода пользователя из системы
function clearAuth(data: TServerResponse<{}>) {
  if (data.success) {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    deleteCookie(ACCESS_TOKEN_KEY);
  }
  return data;
}

// Структура данных для управления состоянием
export interface UserState {
  isUserLoading: boolean;
  userData: TUser | null; // Информация профиля
  userOrders: TOrder[] | null; // Заказы пользователя
  userError: string | null;
}

// Начальное состояние пользователя
const initialState: UserState = {
  isUserLoading: false,
  userData: null,
  userOrders: null,
  userError: null
};

// Слайс управления состоянием пользователя
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    selectUserData: (state) => state.userData,
    selectUserOrders: (state) => state.userOrders,
    selectIsUserLoading: (state) => state.isUserLoading,
    selectUserError: (state) => state.userError,
    selectIsAuthenticated: (state) => state.userData !== null
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isUserLoading = true;
        state.userError = null;
      })
      .addCase(registerUser.rejected, (state, { error }) => {
        state.isUserLoading = false;
        state.userError = error.message || 'Ошибка регистрации';
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.isUserLoading = false;
        if (payload.success) {
          state.userData = payload.user;
          state.userError = null;
        }
      });

    builder
      .addCase(fetchUserData.pending, (state) => {
        state.isUserLoading = true;
        state.userError = null;
      })
      .addCase(fetchUserData.rejected, (state, { error }) => {
        state.isUserLoading = false;
        state.userError =
          error.message || 'Ошибка получения данных пользователя';
        state.userData = null;
      })
      .addCase(fetchUserData.fulfilled, (state, { payload }) => {
        state.isUserLoading = false;
        if (payload.success) {
          state.userData = payload.user;
          state.userError = null;
        }
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.isUserLoading = true;
        state.userError = null;
      })
      .addCase(loginUser.rejected, (state, { error }) => {
        state.isUserLoading = false;
        state.userError = error.message || 'Ошибка входа';
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.isUserLoading = false;
        if (payload.success) {
          state.userData = payload.user;
          state.userError = null;
        }
      });

    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isUserLoading = true;
        state.userError = null;
      })
      .addCase(updateUserProfile.rejected, (state, { error }) => {
        state.isUserLoading = false;
        state.userError = error.message || 'Ошибка обновления профиля';
      })
      .addCase(updateUserProfile.fulfilled, (state, { payload }) => {
        state.isUserLoading = false;
        if (payload.success) {
          state.userData = payload.user;
          state.userError = null;
        }
      });

    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.userError = null;
      })
      .addCase(fetchUserOrders.rejected, (state, { error }) => {
        state.userError = error.message || 'Ошибка получения заказов';
      })
      .addCase(fetchUserOrders.fulfilled, (state, { payload }) => {
        state.userOrders = payload;
        state.userError = null;
      });

    builder
      .addCase(resetUserPassword.pending, (state) => {
        state.isUserLoading = true;
        state.userError = null;
      })
      .addCase(resetUserPassword.rejected, (state, { error }) => {
        state.isUserLoading = false;
        state.userError = error.message || 'Ошибка сброса пароля';
      })
      .addCase(resetUserPassword.fulfilled, (state, { payload }) => {
        state.isUserLoading = false;
        if (payload.success) {
          state.userError = null;
        }
      });

    builder
      .addCase(logoutUser.pending, (state) => {
        state.isUserLoading = true;
        state.userError = null;
      })
      .addCase(logoutUser.rejected, (state, { error }) => {
        state.isUserLoading = false;
        state.userError = error.message || 'Ошибка выхода';
      })
      .addCase(logoutUser.fulfilled, (state, { payload }) => {
        state.isUserLoading = false;
        if (payload.success) {
          state.userData = null;
          state.userOrders = null;
          state.userError = null;
        }
      });
  }
});

export const {
  selectUserData,
  selectUserOrders,
  selectIsUserLoading,
  selectUserError,
  selectIsAuthenticated
} = userSlice.selectors;

export default userSlice.reducer;

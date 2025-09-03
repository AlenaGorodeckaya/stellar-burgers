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

// Константы для ключей хранения токенов
const REFRESH_TOKEN_KEY = 'refreshToken';
const ACCESS_TOKEN_KEY = 'accessToken';

// Обработка аутентификации пользователя (*успех*)
function handleUserAuthSuccess(
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
function handleUserLogout(data: TServerResponse<{}>) {
  if (data.success) {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    deleteCookie(ACCESS_TOKEN_KEY);
  }
  return data;
}

// Асинхронные действия пользователя (thunks)

// Регистрация нового пользователя
export const registerUser = createAsyncThunk(
  'user/register',
  async (userData: TRegisterData) =>
    registerUserApi(userData).then(handleUserAuthSuccess)
);

// Получение данных о текущем пользователе
export const fetchUserData = createAsyncThunk('user/fetchData', getUserApi);

// Аутентификация пользователя
export const loginUser = createAsyncThunk(
  'user/login',
  async (userCredentials: TLoginData) =>
    loginUserApi(userCredentials).then(handleUserAuthSuccess)
);

// Получение списка заказов пользователя
export const fetchUserOrders = createAsyncThunk(
  'user/fetchOrders',
  getOrdersApi
);

// Обновление профиля пользователя
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  updateUserApi
);

// Выход пользователя из системы
export const logoutUser = createAsyncThunk('user/logout', async () =>
  logoutApi().then(handleUserLogout)
);

// Сброс пароля пользователя
export const resetUserPassword = createAsyncThunk(
  'user/resetPassword',
  async (passwordData: { password: string; token: string }) =>
    resetPasswordApi(passwordData)
);

// Структура данных дял управления состоянием
export interface UserState {
  userData: TUser | null; // Информация профиля
  userOrders: TOrder[] | null; // Заказы пользователя
  isUserLoading: boolean;
  userError: string | null;
}

// Начальное состояние пользователя
const initialUserState: UserState = {
  userData: null,
  userOrders: null,
  isUserLoading: false,
  userError: null
};

// Слайс управления состоянием пользователя

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {},
  selectors: {
    selectUserData: (state) => state.userData,
    selectUserOrders: (state) => state.userOrders,
    selectIsUserLoading: (state) => state.isUserLoading,
    selectUserError: (state) => state.userError,
    selectIsAuthenticated: (state) => state.userData !== null
  },
  extraReducers: (builder) => {
    // Обработчики для registerUser
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

    // Обработчики для fetchUserData
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.isUserLoading = true;
        state.userError = null;
      })
      .addCase(fetchUserData.rejected, (state, { error }) => {
        state.isUserLoading = false;
        state.userError =
          error.message || 'Ошибка получения данных пользователя';
      })
      .addCase(fetchUserData.fulfilled, (state, { payload }) => {
        state.isUserLoading = false;
        if (payload.success) {
          state.userData = payload.user;
          state.userError = null;
        }
      });

    // Обработчики для loginUser
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

    // Обработчики для updateUserProfile
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

    // Обработчики для fetchUserOrders
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

    // Обработчики для resetUserPassword
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

    // Обработчики для logoutUser
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

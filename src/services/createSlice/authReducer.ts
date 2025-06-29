import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  refreshToken,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi,
  TAuthResponse,
  TRefreshResponse,
  TServerResponse,
  TUserResponse
} from '@api';

interface AuthState {
  userData: TUser | null; // Данные текущего пользователя
  isAuthenticated: boolean; // Флаг авторизации пользователя
  isAuthCheckComplete: boolean; // Флаг завершения проверки авторизации
  isAuthInProgress: boolean; // Флаг выполнения процесса аутентификации
  requestStatus: 'success' | 'failed' | null;
}

// Начальное состояние модуля аутентификации
const initialAuthState: AuthState = {
  userData: null,
  isAuthCheckComplete: false,
  isAuthenticated: false,
  isAuthInProgress: false,
  requestStatus: null
};

// Для регистрации пользователя
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: TRegisterData): Promise<TAuthResponse> =>
    registerUserApi(userData)
);

// Для входа пользователя
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: TLoginData, { dispatch }) => {
    dispatch(resetRequestStatus());
    return loginUserApi(credentials);
  }
);

// Для выхода пользователя
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (): Promise<TServerResponse<{}>> => {
    if (localStorage.getItem('refreshToken')) {
      return logoutApi();
    }
    return { success: false };
  }
);

// Обновление профиля
export const updateUserProfile = createAsyncThunk<
  TUserResponse,
  Partial<TUser>
>('auth/updateUserProfile', async (profileData, { dispatch }) => {
  dispatch(resetRequestStatus());
  return updateUserApi(profileData);
});

// Получение данных
const fetchUserProfile = createAsyncThunk<TUserResponse>(
  'auth/fetchUserProfile',
  async () => getUserApi()
);

// Обновление доступа, обновление токена
export const refreshAuthToken = createAsyncThunk(
  'auth/refreshAuthToken',
  async (): Promise<TRefreshResponse> => refreshToken()
);

// Проверка авторизации
export const checkUserAuth = createAsyncThunk(
  'auth/checkUserAuth',
  async (_, { dispatch }) => {
    dispatch(resetRequestStatus());
    dispatch(setAuthInProgress(true));
    const accessToken = getCookie('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    try {
      if (accessToken) {
        try {
          await dispatch(fetchUserProfile()).unwrap();
        } catch (error) {
          if (refreshToken) {
            await dispatch(refreshAuthToken()).unwrap();
          }
        }
      } else if (refreshToken) {
        try {
          await dispatch(refreshAuthToken()).unwrap();
          await dispatch(fetchUserProfile()).unwrap();
        } catch (error) {
          // Ошибка обновления токена или запроса данных пользователя
        }
      }
    } finally {
      dispatch(markAuthCheckComplete());
      dispatch(setAuthInProgress(false));
    }
  }
);

// Слайс аутентификации
const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    // Очистка данных аутентификации
    clearAuthData: (state) => {
      state.userData = null;
      state.isAuthCheckComplete = false;
      state.isAuthenticated = false;
    },

    // Обновление полследнего запроса
    resetRequestStatus: (state) => {
      state.requestStatus = null;
    },

    markAuthCheckComplete: (state) => {
      state.isAuthCheckComplete = true;
    },

    // Устанавливает статус авторизации
    setAuthStatus: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setAuthInProgress: (state, action: PayloadAction<boolean>) => {
      state.isAuthInProgress = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder

      // Обработка успешной регистрации
      .addCase(registerUser.fulfilled, (state, action) => {
        state.requestStatus = action.payload.success ? 'success' : 'failed';
      })

      // Обработка успешного выхода
      .addCase(logoutUser.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isAuthenticated = false;
          state.userData = null;
          deleteCookie('accessToken');
          localStorage.removeItem('refreshToken');
        }
      })

      // Обработка успешного обновления профиля
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.requestStatus = 'success';
          state.userData = action.payload.user;
        } else {
          state.requestStatus = 'failed';
        }
      })

      // Обработка ошибки обновления профиля
      .addCase(updateUserProfile.rejected, (state) => {
        state.requestStatus = 'failed';
      })

      // Обработка успешного входа
      .addCase(loginUser.fulfilled, (state, action) => {
        if (action.payload.success) {
          localStorage.setItem('refreshToken', action.payload.refreshToken);
          setCookie('accessToken', action.payload.accessToken);
          state.userData = action.payload.user;
          state.isAuthCheckComplete = true;
          state.isAuthenticated = true;
          state.requestStatus = 'success';
        } else {
          state.requestStatus = 'failed';
        }
      })

      // Обработка ошибки входа
      .addCase(loginUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.requestStatus = 'failed';
        state.isAuthCheckComplete = true;
      })

      // Обработка успешного получения данных пользователя
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isAuthenticated = true;
          state.userData = {
            email: action.payload.user.email,
            name: action.payload.user.name
          };
        } else {
          state.isAuthenticated = false;
          state.userData = null;
        }
      })

      // Обработка ошибки получения данных пользователя
      .addCase(fetchUserProfile.rejected, (state) => {
        state.isAuthenticated = false;
        state.userData = null;
      });
  }
});

export default authSlice.reducer;

export const {
  clearAuthData,
  resetRequestStatus,
  markAuthCheckComplete,
  setAuthStatus,
  setAuthInProgress
} = authSlice.actions;

// Готово

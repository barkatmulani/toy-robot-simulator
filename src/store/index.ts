import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import robotReducer from './slices/robotSlice';

import 'bootstrap/dist/css/bootstrap.min.css';

export const combinedReducers = {
  reducer: {
    robot: robotReducer,
  },
};

export const store = configureStore(combinedReducers);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export * from './slices/robotSlice';
export * from './hooks';
export * from './models';
export * from './constants';
export * from './selectors/robotSelector';

export default robotReducer;

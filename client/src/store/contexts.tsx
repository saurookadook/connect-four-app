import { Dispatch, createContext } from 'react';
import combineReducers from '@saurookkadookk/react-utils-combine-reducers';

import { type AppState, initialAppState } from '@/store/reducer';

export type AppDispatch = Dispatch<combineReducers.ReducerAction<unknown>>;

export const AppStateContext = createContext<AppState>(initialAppState);
// TODO: Fix any type

export const AppDispatchContext = createContext<AppDispatch>(({ type, payload }) => ({
  type,
  payload,
}));

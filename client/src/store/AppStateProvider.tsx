import * as React from 'react';
import { useReducer } from 'react';

import { AppStateContext, AppDispatchContext } from '@/store/contexts';
import combinedReducer, { AppState, initialAppState } from '@/store/reducer';
import { deeplyMerge } from '@/utils';

export function AppStateProvider({
  children,
  initialState = initialAppState,
}: {
  children: React.ReactElement;
  initialState?: AppState;
}) {
  const [combinedReducerFunc, combinedInitialState] = combinedReducer;

  const recursivelyMergedInitialState = deeplyMerge(combinedInitialState, initialState);
  const [state, dispatch] = useReducer(combinedReducerFunc, recursivelyMergedInitialState);

  return (
    <AppStateContext.Provider value={state as AppState}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

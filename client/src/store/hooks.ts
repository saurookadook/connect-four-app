import { useContext } from 'react';

import { AppStateContext, AppDispatchContext } from './contexts';

export function useAppStore() {
  const state = useContext(AppStateContext);
  const dispatch = useContext(AppDispatchContext);

  return {
    appState: state, // force formatting
    appDispatch: dispatch,
  };
}

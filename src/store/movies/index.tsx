import React from "react";
import { NMovies } from "./@types";
import { actions } from "./actions";
import { reducer, initialState } from "./reducer";
// import { moviesSelectors } from './selectors';

export { NMovies };

const storeContext = React.createContext<NMovies.IStoreContext>(null!);

const StoreProvider: React.FC = (properties) => {
  // @ts-ignore
  const [store, dispatch] = React.useReducer(reducer, initialState),
    contextValue = React.useMemo(() => ({ store, dispatch }), [store]);

  return (
    <storeContext.Provider
      value={contextValue}
      children={properties.children}
    />
  );
};

function useSelector(selector: any) {
  const { store } = React.useContext(StoreMovies.context);
  return selector(store);
}

export const StoreMovies = {
  provider: StoreProvider,
  context: storeContext,
  API: actions,
  // selectors: moviesSelectors,
  useSelector,
};

import { NMovies } from "./@types";

export const initialState: NMovies.IStore = {
  list: [],
  map: {},
  loading: null,
  total_results: null,
};

//TODO: add Immer
export function reducer(
  store: NMovies.IStore,
  action: NMovies.IActions
): NMovies.IStore {
  console.log("@@ reducer", action);
  switch (action.type) {
    case NMovies.ActionTypes.MOVIES_FETCH_START:
      return { ...store, loading: true };

    case NMovies.ActionTypes.MOVIES_FETCH_SUCCESSFUL: {
      return {
        ...store,
        loading: false,
        list: action.payload.reduce((accumulator, currentMovie) => {
          accumulator.push(currentMovie.id);
          return accumulator;
        }, store.list),
        map: action.payload.reduce((accumulator, currentMovie) => {
          accumulator[currentMovie.id] = currentMovie;
          return accumulator;
        }, store.map),
      };
    }

    default:
      return store;
  }
}

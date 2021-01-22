import { NMovies } from "./@types";

export const initialState: NMovies.IStore = {
  list: [],
  map: {},
  genres: {},
  loading: null,
  total_results: null,
};

//TODO: add Immer
export function reducer(
  store: NMovies.IStore,
  action: NMovies.IActions
): NMovies.IStore {
  switch (action.type) {
    case NMovies.ActionTypes.MOVIES_FETCH_START:
      return { ...store, loading: true };

    case NMovies.ActionTypes.MOVIES_FETCH_SUCCESSFUL: {
      return {
        ...store,
        loading: false,
        list: action.payload.reduce(
          (accumulator, currentMovie) => {
            accumulator.push(currentMovie.id);
            return accumulator;
          },
          [...store.list]
        ),
        map: action.payload.reduce(
          (accumulator, currentMovie) => {
            accumulator[currentMovie.id] = currentMovie;
            return accumulator;
          },
          { ...store.map }
        ),
      };
    }

    case NMovies.ActionTypes.GENRES_FETCH_SUCCESSFUL:
      return {
        ...store,
        loading: false,
        genres: action.payload.reduce(
          (accumulator: NMovies.IStore["genres"], currentGenre) => {
            accumulator[currentGenre.id] = currentGenre;
            return accumulator;
          },
          { ...store.genres }
        ),
      };

    default:
      return store;
  }
}

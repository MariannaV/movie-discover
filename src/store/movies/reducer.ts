import { NMovies } from "./@types";

export const initialState: NMovies.IStore = {
  list: [],
  map: {},
  genres: {},
  loading: null,
  total_results: null,
  total_pages: null,
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
      const { page, pageSize } = action.meta;

      return {
        ...store,
        loading: false,
        list: [
          ...store.list.slice(0, (page - 1) * pageSize!),
          ...action.payload.map((currentMovie) => currentMovie.id),
          ...store.list.slice(page * pageSize!),
        ],
        map: action.payload.reduce(
          (accumulator, currentMovie) => {
            accumulator[currentMovie.id] = currentMovie;
            return accumulator;
          },
          { ...store.map }
        ),
        total_results: action.meta.total_results,
        total_pages: action.meta.total_pages,
      };
    }

    case NMovies.ActionTypes.MOVIE_FETCH_SUCCESSFUL:
      const { movieId } = action.meta;

      return {
        ...store,
        map: {
          ...store.map,
          [movieId]: action.payload,
        },
      };

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

import produce from "immer";
import { NMovies } from "./@types";

export const initialState: NMovies.IStore = {
  list: [],
  map: {},
  genres: {},
  loading: null,
  total_results: null,
  total_pages: null,
};

export const reducer = produce(
  (store: NMovies.IStore, action: NMovies.IActions) => {
    switch (action.type) {
      case NMovies.ActionTypes.LOADING_START:
        return { ...store, loading: true };
      case NMovies.ActionTypes.LOADING_END:
        return { ...store, loading: false };

      case NMovies.ActionTypes.MOVIES_FETCH_SUCCESSFUL: {
        const { page, pageSize, total_results } = action.meta;

        store.total_results = total_results;
        store.total_pages = action.meta.total_pages;

        if (!store.list.length)
          store.list = Array(total_results).fill(0) as Array<number>;

        const indexStart = (page - 1) * pageSize;
        for (let index = 0; index < action.payload.length; index++)
          store.list[indexStart + index] = action.payload[index].id;

        action.payload.forEach((currentMovie) => {
          store.map[currentMovie.id] = currentMovie;
        });
        break;
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
          genres: action.payload.reduce(
            (accumulator: NMovies.IStore["genres"], currentGenre) => {
              accumulator[currentGenre.id] = currentGenre;
              return accumulator;
            },
            { ...store.genres }
          ),
        };
    }

    return store;
  },
  initialState
);

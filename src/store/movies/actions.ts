import { NMovies } from "./@types";
import { Dispatch } from "react";

export const actions = {
  loadingStart: (dispatch: Dispatch<NMovies.IActions>) => () =>
    dispatch({
      type: NMovies.ActionTypes.LOADING_START,
    }),

  loadingEnd: (dispatch: Dispatch<NMovies.IActions>) => () =>
    dispatch({
      type: NMovies.ActionTypes.LOADING_END,
    }),

  moviesFetchSuccessful: (dispatch: Dispatch<NMovies.IActions>) => (
    parameters: Omit<NMovies.IMoviesFetchSuccessful, "type">
  ) =>
    dispatch({
      type: NMovies.ActionTypes.MOVIES_FETCH_SUCCESSFUL,
      ...parameters,
    }),
  movieFetchSuccessful: (dispatch: Dispatch<NMovies.IActions>) => (
    parameters: Omit<NMovies.IMovieFetchSuccessful, "type">
  ) =>
    dispatch({
      type: NMovies.ActionTypes.MOVIE_FETCH_SUCCESSFUL,
      ...parameters,
    }),
  genresFetchSuccessful: (dispatch: Dispatch<NMovies.IActions>) => (
    parameters: Omit<NMovies.IGenresFetchSuccessful, "type">
  ) =>
    dispatch({
      type: NMovies.ActionTypes.GENRES_FETCH_SUCCESSFUL,
      ...parameters,
    }),
};

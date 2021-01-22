import { NMovies } from "./@types";
import { Dispatch } from "react";

export const actions = {
  moviesFetchStart: (dispatch: Dispatch<NMovies.IActions>) => () =>
    dispatch({ type: NMovies.ActionTypes.MOVIES_FETCH_START }),
  moviesFetchSuccessful: (dispatch: Dispatch<NMovies.IActions>) => (
    parameters: Omit<NMovies.IMoviesFetchSuccessful, "type">
  ) =>
    dispatch({
      type: NMovies.ActionTypes.MOVIES_FETCH_SUCCESSFUL,
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
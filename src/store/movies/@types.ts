export namespace NMovies {
  export interface IMovie {
    id: number;
    adult: boolean;
    backdrop_path: string;
    genre_id: Array<number>;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
  }

  export interface IGenre {
    id: number;
    name: string;
  }

  export interface IStore {
    list: Array<IMovie["id"]>;
    map: Record<IMovie["id"], IMovie & { loading?: boolean }>;
    genres: Record<IGenre["id"], IGenre>;
    loading: boolean | null;
    total_results: null | number;
    total_pages: null | number;
    authData: IAuthData;
  }
  export interface IAuthData {
    requestToken: null | string;
    sessionId: null | string;
    userId: null | number;
  }

  export interface IStoreContext {
    store: IStore;
    dispatch: React.Dispatch<IActions>;
  }

  export type IActions =
    | ILoadingStart
    | ILoadingEnd
    | IMoviesFetchSuccessful
    | IMovieFetchSuccessful
    | IGenresFetchSuccessful
    | IAuthorizationFetchSuccessful;

  export enum ActionTypes {
    LOADING_START,
    LOADING_END,
    MOVIES_FETCH_SUCCESSFUL,
    MOVIE_FETCH_SUCCESSFUL,
    GENRES_FETCH_SUCCESSFUL,
    AUTHORIZATION_FETCH_SUCCESSFUL,
  }

  export interface ILoadingStart {
    type: ActionTypes.LOADING_START;
  }

  export interface ILoadingEnd {
    type: ActionTypes.LOADING_END;
  }

  export interface IMoviesFetchSuccessful {
    type: ActionTypes.MOVIES_FETCH_SUCCESSFUL;
    payload: Array<IMovie>;
    meta: {
      page: number;
      pageSize: number;
      total_pages: number;
      total_results: IStore["total_results"];
    };
  }

  export interface IMovieFetchSuccessful {
    type: ActionTypes.MOVIE_FETCH_SUCCESSFUL;
    payload: any;
    meta: any;
  }

  export interface IGenresFetchSuccessful {
    type: ActionTypes.GENRES_FETCH_SUCCESSFUL;
    payload: Array<IGenre>;
  }

  export interface IAuthorizationFetchSuccessful {
    type: ActionTypes.AUTHORIZATION_FETCH_SUCCESSFUL;
    payload: any;
  }
}

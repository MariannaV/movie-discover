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
    // genres: Record<any, any>;
    loading: boolean | null;
    total_results: null | number;
    total_pages: null | number;
  }

  export interface IStoreContext {
    store: IStore;
    dispatch: React.Dispatch<any>;
  }

  export type IActions =
    | IMoviesFetchStart
    | IMoviesFetchSuccessful
    | IGenresFetchSuccessful;

  export enum ActionTypes {
    MOVIES_FETCH_START,
    MOVIES_FETCH_SUCCESSFUL,
    GENRES_FETCH_SUCCESSFUL,
  }

  export interface IMoviesFetchStart {
    type: ActionTypes.MOVIES_FETCH_START;
  }

  export interface IMoviesFetchSuccessful {
    type: ActionTypes.MOVIES_FETCH_SUCCESSFUL;
    payload: Array<IMovie>;
    meta: {
      page: number;
      pageSize?: number;
      total_pages: number;
      total_results: IStore["total_results"];
    };
  }
  export interface IGenresFetchSuccessful {
    type: ActionTypes.GENRES_FETCH_SUCCESSFUL;
    payload: Array<IGenre>;
  }
}

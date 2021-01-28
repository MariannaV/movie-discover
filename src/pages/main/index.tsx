import React from "react";
import { NMovies, StoreMovies } from "../../store/movies";
import { MOVIE_API_KEY } from "../../consts";
import styles from "./index.scss";
import { Header, sortBy } from "./header/index";
import { pageSize } from "../../consts";
import { MoviesList } from "./list/index";

export function MoviesPage(): React.ReactElement {
  const { dispatch } = React.useContext(StoreMovies.context);
  const moviesData: any = StoreMovies.useSelector(
    (store: NMovies.IStore) => store
  );

  const [sort, setSort] = React.useState<sortBy>(sortBy.popularity),
    sort_by = (() => {
      switch (sort) {
        case sortBy.popularity:
          return "popularity.desc";
        case sortBy.novelty:
          return "primary_release_date.desc";
        case sortBy.rating:
          return "vote_average.desc";
        default:
          return;
      }
    })();

  const [genresFilter, setGenresFilters] = React.useState<Array<
      NMovies.IGenre["id"]
    > | null>(null),
    movieIds = React.useMemo(() => {
      let list = [...moviesData.list];

      if (genresFilter?.length)
        list = list.filter((movieId) => {
          if (!movieId) return false;
          const movieData = moviesData.map[movieId];
          return (
            movieData.genre_ids ?? movieData.genres
          ).some((genreId: number) => genresFilter.includes(genreId));
        });

      return list;
    }, [moviesData.list, genresFilter, sort]);

  React.useEffect(
    function fetchAllData() {
      fetchData();

      async function fetchData() {
        try {
          StoreMovies.API.loadingStart(dispatch)();
          const [movies, genres] = await Promise.all([
            fetch(
              `https://api.themoviedb.org/3/discover/movie?api_key=${MOVIE_API_KEY}&sort_by=${sort_by}`
            ),
            fetch(
              `https://api.themoviedb.org/3/genre/movie/list?api_key=${MOVIE_API_KEY}`
            ),
          ]);
          if (!movies.ok || !genres.ok) {
            throw new Error("Something went wrong");
          }

          const {
            results: moviesData,
            ...restMoviesData
          } = await movies.json();
          StoreMovies.API.moviesFetchSuccessful(dispatch)({
            payload: moviesData,
            meta: {
              ...restMoviesData,
              page: 1,
              pageSize,
            },
          });

          StoreMovies.API.genresFetchSuccessful(dispatch)({
            payload: (await genres.json()).genres,
          });
        } catch (error) {
          console.error(error);
        } finally {
          StoreMovies.API.loadingEnd(dispatch)();
        }
      }
    },
    [sort]
  );

  return (
    <div className={styles.mainWrapper}>
      <h1>Movie Discover</h1>
      <Header
        setSort={setSort}
        setGenresFilters={setGenresFilters}
        sortBy={sort}
      />
      <MoviesList moviesList={movieIds} sort_by={sort_by} />
    </div>
  );
}

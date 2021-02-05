import React, { Suspense } from "react";
import { NMovies, StoreMovies } from "../../store/movies";
import { MOVIE_API_KEY, pageSize } from "../../consts";
import styles from "./index.scss";
import { sortBy } from "./filters/index";
import { Loader } from "../../components/loader";

const MoviesList = React.lazy(() => import("./list/index"));
const ViewSettings = React.lazy(() => import("./filters/index"));

export default function PageMovies(): React.ReactElement {
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
      <Suspense
        fallback={<Loader />}
        children={
          <ViewSettings
            setSort={setSort}
            setGenresFilters={setGenresFilters}
            sortBy={sort}
          />
        }
      />
      <Suspense
        fallback={<Loader />}
        children={<MoviesList moviesList={movieIds} sort_by={sort_by} />}
      />
    </div>
  );
}

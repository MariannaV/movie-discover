import React, { ReactElement } from "react";
import { NMovies, StoreMovies } from "../../store/movies";
import { Link } from "react-router-dom";
import { MOVIE_API_KEY } from "../../consts";
import { List } from "antd";
import styles from "./index.scss";
import { Header, sortBy } from "./header/index";

const pageSize = 20;

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
      <h1>Movie Discovery</h1>
      <Header
        setSort={setSort}
        setGenresFilters={setGenresFilters}
        sortBy={sort}
      />
      <MoviesList moviesList={movieIds} sort_by={sort_by} />
    </div>
  );
}

function MoviesList(props: {
  moviesList: NMovies.IStore["list"];
  sort_by?: string;
}): ReactElement {
  const moviesData: any = StoreMovies.useSelector(
    (store: NMovies.IStore) => store
  );
  const { dispatch } = React.useContext(StoreMovies.context);

  const { genres } = moviesData;
  const { moviesList } = props;

  const onPaginationChange = React.useCallback(
    async (page) => {
      try {
        StoreMovies.API.loadingStart(dispatch)();
        const movies = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${MOVIE_API_KEY}&page=${page}&sort_by=${props.sort_by}`
        );

        if (!movies.ok) {
          throw new Error("Something went wrong");
        }

        const { results: moviesData, ...restMoviesData } = await movies.json();
        StoreMovies.API.moviesFetchSuccessful(dispatch)({
          payload: moviesData,
          meta: {
            ...restMoviesData,
            page,
            pageSize,
          },
        });
        StoreMovies.API.loadingEnd(dispatch)();
      } catch (error) {
        console.error(error);
      }
    },
    [props.sort_by]
  );

  const onRenderItem = React.useCallback(
    (movieId) => {
      if (!movieId) return null;
      const movie = moviesData.map[movieId];
      return (
        <Link to={`/card/${movieId}`} key={movieId}>
          <List.Item
            extra={
              <img
                width={120}
                height={200}
                alt="movie poster"
                src={
                  movie.poster_path === null
                    ? require(`assets/img/no-image.png`).default
                    : `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${movie.poster_path}`
                }
              />
            }
          >
            <List.Item.Meta title={movie.title} />
            <p>{`Popularity: ${movie.popularity}`}</p>
            {(() => {
              const dateOfRelease = new Date(movie.release_date).toDateString();
              if (dateOfRelease === "Invalid Date") return null;
              return <p children={`Date of release: ${dateOfRelease}`} />;
            })()}

            <p>{`Rating: ${movie.vote_average}`}</p>
            <p>{`Genres: ${(movie.genre_ids ?? movie.genres).map(
              (genreId: any) => genres[genreId]?.name
            )}`}</p>
          </List.Item>
        </Link>
      );
    },
    [moviesData.map, genres]
  );

  return (
    <List
      itemLayout="vertical"
      size="small"
      pagination={{
        total: moviesList.length,
        pageSize: 20,
        showSizeChanger: false,
        onChange: onPaginationChange,
      }}
      loading={moviesData.loading}
      dataSource={moviesList}
      renderItem={onRenderItem}
    />
  );
}

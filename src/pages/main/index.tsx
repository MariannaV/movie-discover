import React, { ReactElement } from "react";
import { NMovies, StoreMovies } from "../../store/movies";
import { Link } from "react-router-dom";
import { MOVIE_API_KEY } from "../../consts";
import { List } from "antd";
import styles from "./index.scss";
import { Header, sortBy } from "./header/index";

export function MoviesPage(): React.ReactElement {
  useFetcherCommonData();

  const moviesData: any = StoreMovies.useSelector(
    (store: NMovies.IStore) => store
  );

  const [sort, setSort] = React.useState<sortBy>(sortBy.popularity),
    [genresFilter, setGenresFilters] = React.useState<Array<
      NMovies.IGenre["id"]
    > | null>(null),
    movieIds = React.useMemo(() => {
      let list = [...moviesData.list];

      if (genresFilter?.length)
        list = list.filter((movieId) => {
          const movieData = moviesData.map[movieId];
          return movieData.genre_ids.some((genreId: number) =>
            genresFilter.includes(genreId)
          );
        });

      switch (sort) {
        case sortBy.popularity:
        case sortBy.rating: {
          list.sort(function (firstMovieId: any, secondMovieId: any) {
            let key =
              sort === sortBy.popularity ? "popularity" : "vote_average";
            return (
              moviesData.map[secondMovieId][key] -
              moviesData.map[firstMovieId][key]
            );
          });
          break;
        }
        case sortBy.novelty: {
          list.sort(function (firstMovieId: any, secondMovieId: any) {
            // @ts-ignore
            return (new Date(moviesData.map[secondMovieId].release_date) - new Date(moviesData.map[firstMovieId].release_date));
          });
          break;
        }
        default:
          break;
      }
      return list;
    }, [moviesData.list, genresFilter, sort]);

  return (
    <>
      <div className={styles.mainWrapper}>
        <h1>Movie Discovery</h1>
        <Header
          setSort={setSort}
          setGenresFilters={setGenresFilters}
          sortBy={sort}
        />
        {moviesData.loading ? (
          "Loading..."
        ) : (
          <>
            <MoviesList moviesList={movieIds!} />
            <p children={`All movies: ${moviesData.total_results}`} />
          </>
        )}
      </div>
    </>
  );
}

function useFetcherCommonData() {
  const { dispatch } = React.useContext(StoreMovies.context);

  React.useEffect(function fetchAllData() {
    fetchData();

    async function fetchData() {
      try {
        //TODO: enable loading
        const [movies, genres] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${MOVIE_API_KEY}`
          ),
          fetch(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${MOVIE_API_KEY}`
          ),
        ]);
        if (!movies.ok || !genres.ok) {
          throw new Error("Something went wrong");
        }

        const { results: moviesData, ...restMoviesData } = await movies.json();
        StoreMovies.API.moviesFetchSuccessful(dispatch)({
          payload: moviesData,
          meta: restMoviesData,
        });

        StoreMovies.API.genresFetchSuccessful(dispatch)({
          payload: (await genres.json()).genres,
        });
        //TODO: disable loader
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  return null;
}

function MoviesList(props: {
  moviesList: NMovies.IStore["list"];
}): ReactElement {
  const moviesData: any = StoreMovies.useSelector(
    (store: NMovies.IStore) => store
  );
  const { dispatch } = React.useContext(StoreMovies.context);

  const { genres } = moviesData;
  const { moviesList } = props;

  console.log(moviesData);

  return (
    <List
      itemLayout="vertical"
      size="small"
      pagination={{
        total: moviesData.total_results,
        pageSize: 20,
        showSizeChanger: false,
        onChange: async (page) => {
          try {
            const pageSize = 20;

            //TODO: enable loading
            const movies = await fetch(
              `https://api.themoviedb.org/3/discover/movie?api_key=${MOVIE_API_KEY}&page=${page}`
            );

            if (!movies.ok) {
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
                page,
                pageSize,
              },
            });
            //TODO: disable loader
          } catch (error) {
            console.error(error);
          }
        },
      }}
      dataSource={moviesList}
      footer={
        <div>
          <b>Movie discovery</b>
        </div>
      }
      renderItem={(movieId) => {
        const movie = moviesData.map[movieId];
        return (
          <Link to={`/card/${movieId}`}>
            <List.Item
              key={movieId}
              extra={
                <img
                  width={120}
                  height={200}
                  alt="movie poster"
                  src={`https://www.themoviedb.org/t/p/w300_and_h450_bestv2${movie.poster_path}`}
                />
              }
            >
              <List.Item.Meta title={<a>{movie.title}</a>} />
              <p>{`Popularity: ${movie.popularity}`}</p>
              <p>{`Date of release: ${new Date(
                movie.release_date
              ).toDateString()}`}</p>
              <p>{`Rating: ${movie.vote_average}`}</p>
              <p>{`Genres: ${movie.genre_ids.map(
                (genreId: any) => genres[genreId]?.name
              )}`}</p>
            </List.Item>
          </Link>
        );
      }}
    />
  );
}

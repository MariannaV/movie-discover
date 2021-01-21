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

  console.log("@@", moviesData);

  const [sort, setSort] = React.useState<sortBy>(sortBy.popularity),
    movieIds = React.useMemo(() => {
      let list = [...moviesData.list];
      switch (sort) {
        case sortBy.popularity:
        case sortBy.rating:
          list = Object.values(moviesData.map).sort(function (
            firstMovie: any,
            secondMovie: any
          ) {
            let key =
              sort === sortBy.popularity ? "popularity" : "vote_average";
            return secondMovie[key] - firstMovie[key];
          });
          console.log("popularity SORT", list);
          break;
        case sortBy.novelty:
          list = Object.values(moviesData.map).sort(function (
            firstMovie: any,
            secondMovie: any
          ) {
            return (
                // @ts-ignore
              new Date(secondMovie.release_date) - new Date(firstMovie.release_date)
            );
          });
          break;
        default:
          return;
      }
      return list.map((movie: any) => movie.id);
    }, [moviesData.list, sort]);

  return (
    <>
      <div className={styles.mainWrapper}>
        <h1>Movie Discovery</h1>
        <Header setSort={setSort} sortBy={sort} />
        <MoviesList moviesList={movieIds} />
        {moviesData.loading ? (
          "Loading..."
        ) : (
          <>
            <p children={`All movies: ${moviesData.list.length}`} />
          </>
        )}
      </div>
    </>
  );
}

function useFetcherCommonData() {
  const { dispatch } = React.useContext(StoreMovies.context);

  React.useEffect(function fetchData() {
    fetchMoviesData();
    console.log("store", StoreMovies);

    async function fetchMoviesData() {
      try {
        StoreMovies.API.moviesFetchStart(dispatch)();
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${MOVIE_API_KEY}`
        );
        if (!response.ok) {
          throw new Error("Something went wrong");
        }

        const { results, ...rest } = await response.json();
        StoreMovies.API.moviesFetchSuccessful(dispatch)({
          payload: results,
          meta: rest,
        });
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

  const { moviesList } = props;
  console.log("MD", moviesList);

  return (
    <List
      itemLayout="vertical"
      size="small"
      pagination={{
        onChange: (page) => {
          console.log(page);
        },
        pageSize: 3,
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
              {`Popularity: ${movie.popularity}`}
              {`Date of release: ${new Date(
                movie.release_date
              ).toDateString()}`}
              {`Rating: ${movie.vote_average}`}
            </List.Item>
          </Link>
        );
      }}
    />
  );
}

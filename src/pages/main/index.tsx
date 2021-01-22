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
        case sortBy.rating: {
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
        }
        case sortBy.novelty: {
          list = Object.values(moviesData.map).sort(function (
              firstMovie: any,
              secondMovie: any
          ) {
            // @ts-ignore
            return new Date(secondMovie.release_date) - new Date(firstMovie.release_date)
          });
          break;
        }
        default:
          break;
      }
      return list.map((movie: any) => movie.id);
    }, [moviesData.list, sort]);

  return (
    <>
      <div className={styles.mainWrapper}>
        <h1>Movie Discovery</h1>
        <Header setSort={setSort} sortBy={sort} />
        {moviesData.loading ? (
          "Loading..."
        ) : (
          <>
            <MoviesList moviesList={movieIds!} />
            <p children={`All movies: ${moviesData.list.length}`} />
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

  const { moviesList } = props;
  console.log("Genres", moviesData);

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

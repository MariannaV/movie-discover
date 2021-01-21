import React, { ReactElement } from "react";
import { NMovies, StoreMovies } from "../../store/movies";
import { Link } from "react-router-dom";
import { MOVIE_API_KEY } from "../../consts";
import { List, Avatar } from "antd";

export function MoviesPage(): React.ReactElement {
  useFetcherCommonData();

  const moviesData: any = StoreMovies.useSelector(
    (store: NMovies.IStore) => store
  );
  return (
    <>
      <div>
        <h1>Movies page</h1>
        <MoviesList moviesData={moviesData} />
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

function MoviesList(props: { moviesData: NMovies.IStore }): ReactElement {
  const { moviesData } = props;
  console.log("MD", moviesData.list);

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
      dataSource={moviesData.list}
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
            </List.Item>
          </Link>
        );
      }}
    />
  );
}

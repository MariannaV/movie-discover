import { NMovies, StoreMovies } from "../../../store/movies";
import React, { ReactElement } from "react";
import { MOVIE_API_KEY } from "../../../consts";
import { Link } from "react-router-dom";
import { List } from "antd";
import { pageSize } from "../../../consts";

export function MoviesList(props: {
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

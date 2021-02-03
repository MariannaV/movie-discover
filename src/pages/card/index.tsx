import React, { Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Button } from "antd";
import styles from "./index.scss";
import { NMovies, StoreMovies } from "../../store/movies";
import { routes } from "../../consts";
import { Loader } from "../../components/loader";

const Header = React.lazy(() => import("../../components/header"));

export default function PageMovieCard() {
  const { movieId } = useParams();
  const { dispatch } = React.useContext(StoreMovies.context);

  React.useEffect(function fetchAllData() {
    fetchData();

    async function fetchData() {
      try {
        StoreMovies.API.loadingStart(dispatch)();
        const movieData = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=4237669ebd35e8010beee2f55fd45546`
        );

        if (!movieData.ok) throw new Error("Something went wrong");

        StoreMovies.API.movieFetchSuccessful(dispatch)({
          payload: await movieData.json(),
          meta: {
            movieId,
          },
        });
        StoreMovies.API.loadingEnd(dispatch)();
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const moviesData: any = StoreMovies.useSelector(
    (store: NMovies.IStore) => store
  );
  const movie = moviesData.map[movieId];

  return (
    <div className={styles.movieCard}>
      <Suspense fallback={<Loader />} children={<Header />} />
      {moviesData.loading || !movie ? (
        <Loader />
      ) : (
        <Card
          bordered
          cover={
            <img
              alt="movie poster"
              src={
                movie.poster_path === null
                  ? require(`assets/img/no-image.png`).default
                  : `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${movie.poster_path}`
              }
            />
          }
        >
          <h2>{movie.title}</h2>
          <Card.Meta title="About film:" />
          <section>
            <p>{`Original language: ${movie.original_language}`}</p>
            <p>{`Original title: ${movie.original_title}`}</p>
            <p>{`Overview: ${movie.overview}`}</p>
            <p>{`Popularity: ${movie.popularity}`}</p>
            <p>{`Release date: ${new Date(
              movie.release_date
            ).toDateString()}`}</p>
            <p>{`Vote average: ${movie.vote_average}`}</p>
            <p>{`Vote count: ${movie.vote_count}`}</p>
            <Link
              to={routes.home}
              children={<Button type="primary" children="Go to main page" />}
            />
          </section>
        </Card>
      )}
    </div>
  );
}

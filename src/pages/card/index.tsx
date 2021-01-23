import React from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Button } from "antd";
import styles from "./index.scss";
import { NMovies, StoreMovies } from "../../store/movies";

export function MovieCard() {
  const { movieId } = useParams();
  const { dispatch } = React.useContext(StoreMovies.context);

  React.useEffect(function fetchAllData() {
    fetchData();

    async function fetchData() {
      try {
        //TODO: enable loading
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
        //TODO: disable loader
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const moviesData: any = StoreMovies.useSelector(
    (store: NMovies.IStore) => store
  );
  const movie = moviesData.map[movieId];

  //add loading and loader
  if (!movie) return null;
console.log('@@ movie', movie)
  return (
    <div className={styles.movieCard}>
      <Card
        bordered
        cover={
          <img
            alt="movie poster"
            src={`https://www.themoviedb.org/t/p/w300_and_h450_bestv2${movie.poster_path}`}
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
          <Link to="/">
            <Button type="primary" children="Go to main page" />
          </Link>
        </section>
      </Card>
    </div>
  );
}

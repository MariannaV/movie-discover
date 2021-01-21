import React from "react";
import { useParams } from "react-router-dom";
import { Card } from "antd";
import styles from "./index.scss";

import { NMovies, StoreMovies } from "../../store/movies";

export function MovieCard(): React.ReactElement {
  let { movieId } = useParams();
  console.log("MC ID", movieId);
  const moviesData: any = StoreMovies.useSelector(
    (store: NMovies.IStore) => store
  );
  const movie = moviesData.map[movieId];
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
        </section>
      </Card>
    </div>
  );
}
import React from "react";
import { StoreMovies } from "../../store/movies";
import { MOVIE_API_KEY } from "../../consts";

export function SearchPage(): React.ReactElement {
  useFetcherCommonData();

  const moviesData: any = StoreMovies.useSelector((store: any) => store);
  console.log("@@ storeData", moviesData);
  return (
    <>
      <div>
        <h1>Search page</h1>
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

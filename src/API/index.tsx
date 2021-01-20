import React from "react";

const MOVIE_API_KEY = '4237669ebd35e8010beee2f55fd45546';


export function FetcherCommonData() {
    React.useEffect(function fetchData() {
        fetchEventsData();
        async function fetchEventsData() {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/discover/movie?api_key=${MOVIE_API_KEY}`
                );
                if (!response.ok) {
                    throw new Error('Something went wrong');
                }
                const result = await response.json();
                console.log(result);
                return result;
            } catch (error) {
                console.error(error);
            }
        }
    }, []);

    return null;
}
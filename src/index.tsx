import "antd/dist/antd.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import CONSTANTS from "./consts";
import { StoreMovies } from "./store/movies";
import { MoviesPage } from "./pages/main";
import { MovieCard } from "./pages/card";

if (CONSTANTS.isProd && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered:", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed:", registrationError);
      });
  });
}

function App() {
  return (
    <Router>
      <StoreMovies.provider>
        <div>
          <Switch>
            <Route path="/card/:movieId">
              <MovieCard />
            </Route>
            <Route path="/">
              <MoviesPage />
            </Route>
          </Switch>
        </div>
      </StoreMovies.provider>
    </Router>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));

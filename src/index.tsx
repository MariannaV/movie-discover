import "antd/dist/antd.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CONSTANTS from "./consts";
import { StoreMovies } from "./store/movies";
import { MoviesPage } from "./pages/main";
import { MovieCard } from "./pages/card";
import { routes } from "./consts";

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
            <Route path={routes.card}>
              <MovieCard />
            </Route>
            <Route path={routes.home}>
              <MoviesPage />
            </Route>
          </Switch>
        </div>
      </StoreMovies.provider>
    </Router>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));

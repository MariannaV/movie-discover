import "antd/dist/antd.css";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CONSTANTS from "./consts";
import { StoreMovies } from "./store/movies";
import { routes } from "./consts";
import { Loader } from "./components/loader";

const MovieCard = React.lazy(() => import("./pages/card"));
const MoviesPage = React.lazy(() => import("./pages/main"));
console.log("@@", MovieCard);

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
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route path={routes.card} component={MovieCard} />
            <Route path={routes.home} component={MoviesPage} />
          </Switch>
        </Suspense>
      </StoreMovies.provider>
    </Router>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));

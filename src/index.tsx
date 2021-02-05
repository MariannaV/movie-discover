import "antd/dist/antd.css";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CONSTANTS from "./consts";
import { StoreMovies } from "./store/movies";
import { routes } from "./consts";
import { Loader } from "./components/loader";
import { Header } from "./components/header";

const PageMovieCard = React.lazy(() => import("./pages/card"));
const PageMovies = React.lazy(() => import("./pages/main"));

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
    <>
      <StoreMovies.provider>
        <Header />
        <Router>
          <Suspense fallback={<Loader />}>
            <Switch>
              <Route path={routes.card} component={PageMovieCard} />
              <Route path={routes.home} component={PageMovies} />
            </Switch>
          </Suspense>
        </Router>
      </StoreMovies.provider>
    </>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));

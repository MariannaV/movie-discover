import React from "react";
import ReactDOM from "react-dom";
import CONSTANTS from "./consts";
import {BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import {SearchPage} from "./pages/main";
import {MovieCard} from "./pages/card";


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

///[{cardId, title}]
//store.cards = { list: [cardId], map: { [cardId]: cardData } }

function App() {
  return (
      <Router>
    <div>
        <Link to='/'>Home</Link>
        <Link to='/card'>card</Link>
        <Switch>
            <Route path="/card">
                <MovieCard/>
            </Route>
            <Route path="/">
                <SearchPage/>
            </Route>

        </Switch>
    </div>
    </Router>
  )
}

ReactDOM.render(<App />, document.querySelector("#root"));




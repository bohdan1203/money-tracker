import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Switch, Route } from "react-router";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/money-tracker" exact component={App} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

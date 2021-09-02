import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Switch, Route } from "react-router";
import App from "./App";


function Asdf() {
  return 'ASDFGHJKL'
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/"  component={App} />
        <Route  path="/asdf"  component={Asdf} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

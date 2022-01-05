import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { subscribeToHttpEvent } from "./common/api/httpClient";
import { logout } from "./common/api/auth";
import "./xdsfr.scss";
import GridDisplayer from "./common/dsfr/GridDisplayer";

window.dsfr = {
  verbose: false,
  mode: "runtime",
};

ReactDOM.render(
  <React.StrictMode>
    <GridDisplayer />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

subscribeToHttpEvent("http:error", (response) => {
  if (response.status === 401) {
    //Auto logout user when token is invalid
    logout();
    window.location.href = "/login";
  }
  console.error(response);
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

require("@gouvfr/dsfr/dist/dsfr/dsfr.module");
require("@gouvfr/dsfr/dist/dsfr/dsfr.nomodule");

import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import NotFound from "./NotFound";
import Menu from "./Menu";
import GameController from "../game/GameController";

/**
 * Defines all the routes for the application.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/menu"} />
      </Route>
      <Route path="/menu">
        <Menu />
      </Route>
      <Route path="/game/:type">
        <GameController />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;

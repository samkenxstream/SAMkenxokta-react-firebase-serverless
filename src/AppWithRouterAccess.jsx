import "./App.css";

import { Route, useHistory } from "react-router-dom";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { Security, LoginCallback } from "@okta/okta-react";

import Home from "./Home";

const {
  REACT_APP_OKTA_ISSUER,
  REACT_APP_OKTA_CLIENTID
} = process.env;

const oktaAuth = new OktaAuth({
  issuer: REACT_APP_OKTA_ISSUER,
  clientId: REACT_APP_OKTA_CLIENTID,
  redirectUri: window.location.origin + "/login/callback",
  scopes: ['openid', 'profile', 'email']
});

function AppWithRouterAccess() {
  const history = useHistory();

  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri || "/", window.location.origin));
  };

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <Route path="/" component={Home} />
      <Route path="/login/callback" component={LoginCallback} />
    </Security>
  );
}

export default AppWithRouterAccess;
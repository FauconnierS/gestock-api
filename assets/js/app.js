/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, withRouter } from "react-router-dom";
import "../styles/app.css";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AuthContext from "./contexts/AuthContext";
import CustomersPage from "./pages/CustomersPage";
import HomePage from "./pages/HomePage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import authAPI from "./services/authAPI";

const auth = authAPI.setup();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(auth);
  const NavBarWithRouter = withRouter(Navbar);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <HashRouter>
        <NavBarWithRouter />
        <main className="container pt-4">
          <Switch>
            <Route path="/login" component={LoginPage} />
            <PrivateRoute path="/invoices" component={InvoicesPage} />
            <PrivateRoute path="/customers" component={CustomersPage} />
            <Route path="/" component={HomePage} />
          </Switch>
        </main>
      </HashRouter>
    </AuthContext.Provider>
  );
};

const rootElement = document.querySelector("#app");

ReactDOM.render(<App />, rootElement);

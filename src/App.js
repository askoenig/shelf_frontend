import React from "react";
import "./App.css";
import "./Bookshelf.css";
// import Bookshelf from "./Bookshelf";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";
import HomePage from "./HomePage";
import FourOhFourPage from "./FourOhFourPage";
import { Switch, Route } from "react-router-dom";

class App extends React.Component {
  state = {
    user: ""
  };

  componentDidMount() {
    this.getCurrentUser();
  }

  getCurrentUser = () => {
    if (localStorage.token) {
      return fetch("http://localhost:3000/profile", {
        headers: {
          Authorization: localStorage.token
        }
      })
        .then(res => res.json())
        .then(profileInfo => this.setState({ user: profileInfo }));
    }
  };

  render() {
    return (
      <Switch>
        <Route
          path="/login"
          render={routerProps => (
            <LoginPage getCurrentUser={this.getCurrentUser} {...routerProps} />
          )}
        />
        <Route
          path="/signup"
          render={routerProps => (
            <SignUpPage getCurrentUser={this.getCurrentUser} {...routerProps} />
          )}
        />
        <Route
          exact
          path="/"
          render={
            this.state.user.id
              ? routerProps =>
                  this.state.user && (
                    <HomePage
                      {...routerProps}
                      user_id={this.state.user.id}
                      username={this.state.user.username}
                    />
                  )
              : routerProps => (
                  <LoginPage
                    getCurrentUser={this.getCurrentUser}
                    {...routerProps}
                  />
                )
          }
        />
        <Route component={FourOhFourPage} />
      </Switch>
    );
  }
}

export default App;

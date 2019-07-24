import React from "react";
import "./App.css";
import "./Bookshelf.css";
// import Bookshelf from "./Bookshelf";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";
import HomePage from "./HomePage";
import MessagesPage from "./MessagesPage";
import FourOhFourPage from "./FourOhFourPage";
import { Switch, Route } from "react-router-dom";

class App extends React.Component {
  state = {
    user: {}
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
          path="/messages"
          render={routerProps => (
            <MessagesPage
              {...routerProps}
              username={this.state.user.username}
            />
          )}
        />
        <Route
          exact
          path="/"
          render={routerProps => (
            <HomePage
              {...routerProps}
              user_id={this.state.user.id}
              username={this.state.user.username}
            />
          )}
        />
        <Route component={FourOhFourPage} />
      </Switch>
    );
  }
}

export default App;

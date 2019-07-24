import React from "react";

class LoginPage extends React.Component {
  state = {
    username: "",
    password: ""
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();

    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(this.state)
    })
      .then(response => response.json())
      .then(parsedResponse => {
        console.log(parsedResponse);
        localStorage.setItem("token", parsedResponse.token);
        this.props.getCurrentUser().then(() => {
          this.props.history.push("/");
        });
      });
  };

  render() {
    // console.log(this.state);
    return (
      <div className="LoginPage">
        <form onSubmit={this.handleSubmit}>
          <input
            value={this.state.username}
            onChange={this.handleChange}
            name="username"
          />
          <input
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
            name="password"
          />
          <input type="submit" value="Log in" />
        </form>
      </div>
    );
  }
}

export default LoginPage;

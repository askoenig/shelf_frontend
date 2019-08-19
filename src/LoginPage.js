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
    return (
      <div className="LoginPage">
        <form className="LoginBox" onSubmit={this.handleSubmit}>
          <h1
            style={{ display: "flex", justifyContent: "center", fontSize: 45 }}
          >
            SHELF.
          </h1>
          <input
            value={this.state.username}
            onChange={this.handleChange}
            name="username"
            placeholder="username"
          />
          <br />
          <input
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
            name="password"
            placeholder="password"
          />
          <br />
          <button type="submit" value="LOG IN" className="LoginButton">
            LOG IN
          </button>
        </form>
      </div>
    );
  }
}

export default LoginPage;

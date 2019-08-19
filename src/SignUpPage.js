import React from "react";

class SignupPage extends React.Component {
  state = {
    username: "",
    password: ""
  };

  handleSubmit = e => {
    e.preventDefault();
    fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(parsedResponse => {
        localStorage.setItem("token", parsedResponse.token);
        this.props.getCurrentUser().then(() => {
          this.props.history.push("/");
        });
      });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className="LoginPage">
        <form onSubmit={this.handleSubmit} className="LoginBox">
          <h1
            style={{ display: "flex", justifyContent: "center", fontSize: 45 }}
          >
            SHELF.
          </h1>
          <input
            type="text"
            value={this.state.username}
            onChange={this.handleChange}
            name="username"
            placeholder="username"
          />
          <input
            type="text"
            value={this.state.password}
            onChange={this.handleChange}
            name="password"
            placeholder="password"
          />
          <button type="submit" value="SIGN UP" className="LoginButton">
            SIGN UP
          </button>
        </form>
      </div>
    );
  }
}

export default SignupPage;

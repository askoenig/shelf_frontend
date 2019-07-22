import React from "react";
import SearchAndSort from "./SearchAndSort";
import { Link } from "react-router-dom";
import Bookshelf from "./Bookshelf";
import "./Bookshelf.css";

class HomePage extends React.Component {
  render() {
    console.log(this.props.username);
    return (
      <div>
        <div className="welcome">
          <h1>
            {" "}
            {this.props.username
              ? `Hello, ${this.props.username}!`
              : "Getting your profile..."}
          </h1>
        </div>
        <ul>
          <li>
            <Link to="/messages">go to messages</Link>
          </li>
        </ul>
        <div>
          <SearchAndSort />
        </div>
        <div>
          <Bookshelf />
        </div>
      </div>
    );
  }
}

export default HomePage;

import React, { Component } from "react";

export default class Book extends Component {
  state = {
    bookColors: ["book-green", "book-blue", "book-umber", "book-springer"],
    bookTilt: ["book-tilted", "", "", "", ""]
  };

  randomizeColor = () => {
    const colors = this.state.bookColors;
    const randomizedColor = colors[Math.floor(Math.random() * colors.length)];
    return randomizedColor;
  };

  handleClick = () => {
    this.props.grabID(this.props.book.id);
  };

  //   randomizeTilt = () => {
  //     const tilt = this.state.bookTilt;
  //     const randomizedTilt = tilt[Math.floor(Math.random() * tilt.length)];
  //     return randomizedTilt;
  //   };

  render() {
    // console.log(this.props.book);
    return (
      //   <div className={this.randomizeTilt()}>
      <div className={`book ${this.randomizeColor()}`}>
        <h2>
          {this.props.book.title}{" "}
          <button className="deleteBook" onClick={this.handleClick}>
            X
          </button>
        </h2>
      </div>
    );
  }
}

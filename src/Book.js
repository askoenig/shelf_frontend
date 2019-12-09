import React, { Component } from "react";

export default class Book extends Component {
  state = {
    // bookColors: ["book-green", "book-blue", "book-umber", "book-springer"],
    // bookTilt: ["book-tilted", "", "", "", ""]
    hover: false
  };

  handleClick = () => {
    this.props.clickBook(this.props.book.id);
  };

  passBookToDeleteFetch = e => {
    e.stopPropagation();
    this.props.grabID(this.props.book.id);
  };

  revealDeleteButton = () => {
    this.setState({
      hover: true
    });
  };

  hideDeleteButton = () => {
    this.setState({
      hover: false
    });
  };

  stringToColour = str => {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = "#";
    for (i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xff;
      colour += ("00" + value.toString(16)).substr(-2);
    }
    return colour;
  };

  // randomizeColor = () => {
  //   const colors = this.state.bookColors;
  //   const randomizedColor = colors[Math.floor(Math.random() * colors.length)];
  //   return randomizedColor;
  // };

  //   randomizeTilt = () => {
  //     const tilt = this.state.bookTilt;
  //     const randomizedTilt = tilt[Math.floor(Math.random() * tilt.length)];
  //     return randomizedTilt;
  //   };

  // randomIntFromInterval = () => {
  //   let min = 600;
  //   let max = 680;
  //   let height = Math.floor(Math.random() * (max - min + 1) + min);
  //   return height;
  // };

  render() {
    const bookColor = {
      backgroundColor: this.stringToColour(this.props.book.googleBookId)
      // height: `${Math.floor(Math.random() * 20 + 180)}px`
    };
    // const bookHeight = {
    //   height: this.randomIntFromInterval()
    // };
    // console.log(bookColor);
    return (
      //   <div className={this.randomizeTilt()}>
      // <div className={`book ${this.randomizeColor()}`}>
      <div
        className="book"
        style={bookColor}
        // className={`book ${this.randomizeColor()}`}
        onMouseOver={this.revealDeleteButton}
        onMouseLeave={this.hideDeleteButton}
        onClick={this.handleClick}
      >
        <h2>
          {this.props.book.title.length < 44
            ? this.props.book.title
            : this.props.book.title.substr(0, 44) + `${" . " + ". " + ". "}`}
          {this.state.hover ? (
            <button className="deleteBook" onClick={this.passBookToDeleteFetch}>
              X
            </button>
          ) : null}
        </h2>
      </div>
    );
  }
}

import React, { Component } from "react";

export default class Book extends Component {
  state = {
    // bookColors: ["book-green", "book-blue", "book-umber", "book-springer"],
    // bookTilt: ["book-tilted", "", "", "", ""]
    hover: false
  };

  handleClick = () => {
    // console.log(this.props.book);
    this.props.clickBook(this.props.book.id);
    // let clickedBook = "";
    // fetch(`http://localhost:3000/books/${this.props.book.book_id}`)
    //   .then(response => response.json())
    //   .then(
    //     bookData =>
    //       (clickedBook = (
    // <div className="searchBookInfo">
    //   <img
    //     className="searchBookImage"
    //     src={bookData.data.attributes.image}
    //     alt="oh no"
    //   />
    //   <h2>
    //     {bookData.data.attributes.title}
    //     {bookData.data.attributes.subtitle}
    //   </h2>
    //   <h4>by: {bookData.data.attributes.authors}</h4>
    //   <h4>Pages: {bookData.data.attributes.pageCount}</h4>
    //   <h4>Published: {bookData.data.attributes.publishedDate}</h4>
    //   <h4>Categories: {bookData.data.attributes.categories}</h4>
    //   <h4>Original Language: {bookData.data.attributes.language}</h4>
    //   <h5>{bookData.data.attributes.description}</h5>
    // </div>
    //       ))
    //   );
    // return clickedBook;
  };

  passBookToDeleteFetch = () => {
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

  render() {
    const bookColor = {
      backgroundColor: this.stringToColour(this.props.book.googleBookId)
    };

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

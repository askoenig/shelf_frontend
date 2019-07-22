import React, { Component } from "react";

export default class SearchBooks extends Component {
  buildBookData = () => {
    const bookData = {
      googleBookId: this.props.book.id.toString(),
      title: this.props.book.volumeInfo.title,
      subtitle: Object.keys(this.props.book.volumeInfo).includes("subtitle")
        ? this.props.book.volumeInfo.subtitle
        : "",
      authors: Object.keys(this.props.book.volumeInfo).includes("authors")
        ? this.props.book.volumeInfo.authors.join(", ")
        : "",
      datePublished: this.props.book.volumeInfo.publishedDate,
      description: this.props.book.volumeInfo.description,
      printedPageCount: this.props.book.volumeInfo.pageCount,
      categories: Object.keys(this.props.book.volumeInfo).includes("categories")
        ? this.props.book.volumeInfo.categories.join(", ")
        : "",
      language: this.props.book.volumeInfo.language,
      image: Object.keys(this.props.book.volumeInfo).includes("imageLinks")
        ? this.props.book.volumeInfo.imageLinks.smallThumbnail
        : "no image"
    };
    return bookData;
  };

  handleClick = event => {
    debugger;
    event.preventDefault();
    fetch("http://localhost:3000/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(this.buildBookData())
    })
      .then(resp => resp.json())
      .then(AddedBookObj => {
        console.log(AddedBookObj);
      });
  };

  render() {
    console.log(this.state);

    return (
      <div>
        <div className="searchBookInfo">
          <img
            className="searchBookImage"
            src={
              Object.keys(this.props.book.volumeInfo).includes("imageLinks")
                ? this.props.book.volumeInfo.imageLinks.smallThumbnail
                : "oh no"
            }
            alt="oh no"
          />
          <h2>{this.props.book.volumeInfo.title}</h2>
          <h4>
            {Object.keys(this.props.book.volumeInfo).includes("subtitle")
              ? `Subtitle: ${this.props.book.volumeInfo.subtitle}`
              : null}
          </h4>
          <h4>
            by:{" "}
            {Object.keys(this.props.book.volumeInfo).includes("authors")
              ? this.props.book.volumeInfo.authors.join(", ")
              : ""}
          </h4>
          <h4>page count: {this.props.book.volumeInfo.pageCount}</h4>
          <h4>published date: {this.props.book.volumeInfo.publishedDate}</h4>
          <h4>categories: {this.props.book.volumeInfo.categories}</h4>
          <h4>original language: {this.props.book.volumeInfo.language}</h4>
          <h5>
            {Object.keys(this.props.book.volumeInfo).includes("description")
              ? `Description: ${this.props.book.volumeInfo.description}`
              : null}
          </h5>
          <button className="button" onClick={this.handleClick}>
            Add Book
          </button>
          <br />
          <br />
        </div>
      </div>
    );
  }
}

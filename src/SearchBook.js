import React, { Component } from "react";

export default class SearchBook extends Component {
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

  // handleClick = () => {
  //   this.props.addBook(this.buildBookData());
  // };
  handleClick = event => {
    // event.preventDefault();
    fetch("http://localhost:3000/findcreate", {
      method: "POST",
      headers: {
        Authorization: `${localStorage.token}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(this.buildBookData())
    }).then(() => {
      this.props.addBook();
    });
    // .then(setTimeout(this.props.addBook, 1000));
  };

  render() {
    return (
      <div>
        <div className="searchBookInfo">
          <img
            className="searchBookImage"
            src={
              Object.keys(this.props.book.volumeInfo).includes("imageLinks")
                ? this.props.book.volumeInfo.imageLinks.thumbnail
                : "oh no"
            }
            alt="oh no"
          />
          <>
            <h2 className="searchBookTitle">
              {this.props.book.volumeInfo.title}

              {Object.keys(this.props.book.volumeInfo).includes("subtitle")
                ? `: ${this.props.book.volumeInfo.subtitle}`
                : null}
            </h2>
            <h3>
              by{" "}
              {Object.keys(this.props.book.volumeInfo).includes("authors")
                ? this.props.book.volumeInfo.authors.join(", ")
                : ""}
            </h3>
          </>
          <h4>
            Pages: {this.props.book.volumeInfo.pageCount}
            <br />
            Published: {this.props.book.volumeInfo.publishedDate}
            <br />
            Categories: {this.props.book.volumeInfo.categories}
            <br />
            Original Language: {this.props.book.volumeInfo.language}
          </h4>
          <h4>
            {Object.keys(this.props.book.volumeInfo).includes("description")
              ? `Description: ${this.props.book.volumeInfo.description}`
              : null}
          </h4>
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

import React, { Component } from "react";
import SearchBooks from "./SearchBooks";

export default class SearchAndSort extends Component {
  state = {
    searchInput: "",
    displayBooks: [
      // {
      //   googleBookId: "",
      //   title: "",
      //   subtitle: "",
      //   authors: "",
      //   datePublished: "",
      //   printedPageCount: "",
      //   categories: "",
      //   language: "",
      //   image: ""
      // }
    ]
  };

  // const = api_KEY => process.env.SHELF_GOOGLE_BOOKS_API_KEY;

  searchForBooks = () => {
    console.log("why God why");
    fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${
        this.state.searchInput
      }&maxResults=20`
    )
      .then(response => response.json())
      .then(searchResults =>
        this.setState({
          displayBooks: searchResults.items
        })
      );
  };

  handleChange = event => {
    event.preventDefault();
    this.setState({
      searchInput: event.target.value
    });
  };

  handleClick = event => {
    event.preventDefault();
    this.searchForBooks();
  };

  render() {
    console.log(this.state.displayBooks);
    const searchBoxBooks = this.state.displayBooks.map(book => (
      <SearchBooks book={book} />
    ));
    return (
      <div className="SearchBar">
        <input
          type="text"
          placeholder={"Search by title, author, or genre.."}
          onChange={this.handleChange}
        />
        <button className="searchBooks" onClick={this.handleClick}>
          Search
        </button>
        <div className="bookSearchResults">{searchBoxBooks}</div>
      </div>
    );
  }
}

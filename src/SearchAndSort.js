import React, { Component } from "react";
import SearchBook from "./SearchBook";

export default class SearchAndSort extends Component {
  state = {
    searchInput: "",
    displayBooks: []
  };

  // const = api_KEY => process.env.SHELF_GOOGLE_BOOKS_API_KEY;

  searchForBooks = () => {
    console.log("why God why");
    fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${
        this.state.searchInput
      }&printType=books&maxResults=30`
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
      <SearchBook book={book} />
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

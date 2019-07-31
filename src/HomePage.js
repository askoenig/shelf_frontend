import React from "react";
// import SearchModal from "./SearchModal";
// import { Link } from "react-router-dom";
import Bookshelf from "./Bookshelf";
import "./Bookshelf.css";
import SearchBook from "./SearchBook";
import Book from "./Book";
import "./App.css";

class HomePage extends React.Component {
  state = {
    searchInput: "",
    displayBooks: [],
    currentUserBooks: [],
    clickedBook: [],
    chosenShelf: "",
    sortMethod: "",
    thoughts: ""
  };

  componentDidMount() {
    if (this.state.sortMethod.length < 1) {
      fetch(`http://localhost:3000/users/${this.props.user_id}`)
        .then(response => response.json())
        .then(userBooksData =>
          this.setState({
            currentUserBooks: userBooksData.data.attributes.user_books.sort(
              (a, b) => a.id - b.id
            )
          })
        );
    }
  }

  getBookChoosenForRemoval = bookID => {
    window.confirm(
      "Are you sure you wish to delete this book from your Shelf?"
    ) &&
      fetch(`http://localhost:3000/user_books/${bookID}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.token,
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }).then(
        this.setState({
          currentUserBooks: this.state.currentUserBooks.filter(
            user_book => user_book.id !== bookID
          )
        })
      );
    this.closeClickedBookDisplay();
  };

  grabSearchInput = event => {
    event.preventDefault();
    this.setState({
      searchInput: event.target.value
    });
  };

  searchForBooks = () => {
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

  getSearchBoxBooks = () => {
    const searchBoxBooks = this.state.displayBooks.map(book => (
      <SearchBook book={book} addBook={this.putSelectedBookOnShelf} />
    ));
    return searchBoxBooks;
  };

  putSelectedBookOnShelf = () => {
    console.log("Hello");
    fetch(`http://localhost:3000/users/${this.props.user_id}`)
      .then(response => response.json())
      .then(userBooksData =>
        this.setState({
          currentUserBooks: userBooksData.data.attributes.user_books
        })
      );
  };

  triggerBookSearch = event => {
    if (event.key === "Enter") {
      this.searchForBooks();
    }
  };

  grabUserThoughts = event => {
    console.log(event.target);
    this.setState({
      thoughts: event.target.value
    });
  };

  handleKeyDown(e) {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }

  editBookThoughts = event => {
    // event.preventDefault();
    fetch(`http://localhost:3000/user_books/${this.state.clickedBook[0].id}`, {
      method: "PATCH",
      headers: {
        Authorization: `${localStorage.token}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ thoughts: this.state.thoughts })
    });
  };

  // IF GOOGLE SETS FETCH REQUEST QUOTA TO UNLIMITED (LOL) FOR MY API KEY,
  // USE COMMENTED CODE BELOW/THROUGH OUT FOR REAL TIME SEARCH RESULTS

  // captureUserSearchInput = event => {
  //   event.preventDefault();
  //   this.setState({
  //     searchInput: event.target.value
  //   });
  //   if (this.state.searchInput.length > 0) {
  //     fetch(
  //       `https://www.googleapis.com/books/v1/volumes?q=${
  //         this.state.searchInput
  //       }&printType=books&maxResults=30&key=AIzaSyDOxvQwmZE3kN5uHIs-7Q2_bLkQ78E_Z54`
  //     )
  //       .then(response => response.json())
  //       .then(searchResults =>
  //         this.setState({
  //           displayBooks: searchResults.items
  //         })
  //       );
  //   }
  // };

  displayClickedBookDetails = bookIdUserClicked => {
    fetch(`http://localhost:3000/user_books/${bookIdUserClicked}`)
      .then(response => response.json())
      .then(clickedBookData =>
        this.setState({
          clickedBook: [clickedBookData.data],
          thoughts: clickedBookData.data.attributes.thoughts || ""
        })
      );
  };

  closeClickedBookDisplay = () => {
    this.setState({
      clickedBook: []
    });
  };

  selectShelf = event => {
    console.log(event.target.value);
    // this.setState({
    //   chosenShelf: event.target.value
    // })
  };

  selectSort = event => {
    if (event.target.value === "Date Added") {
      this.setState({
        currentUserBooks: this.state.currentUserBooks.sort(
          (a, b) => a.id - b.id
        )
      });
    }
    if (event.target.value === "Alphabetically") {
      fetch(`http://localhost:3000/users/${this.props.user_id}`)
        .then(response => response.json())
        .then(userBooksData =>
          this.setState({
            currentUserBooks: userBooksData.data.attributes.user_books.sort(
              (a, b) => a.title.localeCompare(b.title)
            ),
            sortMethod: "alphabetically"
          })
        );
    }
    if (event.target.value === "Author") {
      fetch(`http://localhost:3000/users/${this.props.user_id}`)
        .then(response => response.json())
        .then(userBooksData =>
          this.setState({
            currentUserBooks: userBooksData.data.attributes.user_books.sort(
              (a, b) => a.authors.localeCompare(b.authors)
            ),
            sortMethod: "author"
          })
        );
    }
    // else if (event.target.value === "Page Count")
    // else if (event.target.value === "Date Published")
  };

  // changeShelves = () => {
  //   this.setState({
  //     currentUserBooks: this.state.currentUserBooks.filter(
  //       user_book => user_book.shelves !== choosenShelf
  //     )
  //   });
  // };

  render() {
    console.log(this.state.sortMethod);
    let allLoadedUserBooks = "";
    if (this.state.currentUserBooks.length > 0) {
      allLoadedUserBooks = this.state.currentUserBooks.map(book => {
        return (
          <Book
            book={book}
            grabID={this.getBookChoosenForRemoval}
            clickBook={this.displayClickedBookDetails}
          />
        );
      });
    }
    return (
      <div>
        <div className="banner">SHELF.</div>
        <div className="welcome">
          <h1>
            {" "}
            {this.props.username
              ? `Hello, ${this.props.username}!`
              : "Getting your profile..."}
          </h1>
        </div>
        {/* <ul>
          <li>
            <Link to="/messages">go to messages</Link>
          </li>
        </ul> */}
        <div className="SearchBar">
          <input
            type="text"
            placeholder={"Search by title, author, etc.."}
            // onChange={this.captureUserSearchInput}
            onChange={this.grabSearchInput}
            onKeyPress={this.triggerBookSearch}
          />
          <button className="searchBooks" onClick={this.searchForBooks}>
            Search
          </button>
          {/* <button className="searchBooks">Search</button> */}
          {this.state.searchInput.length > 0 &&
          this.state.displayBooks.length > 0 ? (
            <div className="bookSearchResults">{this.getSearchBoxBooks()}</div>
          ) : null}
          {/* <button className="searchBooks">Search</button> */}
          {this.state.clickedBook.length > 0 && (
            <div className="clickedBookResults">
              <button
                className="closeClickedBookButton"
                onClick={this.closeClickedBookDisplay}
              >
                X
              </button>
              <div className="clickedBookInfo">
                <img
                  className="searchBookImage"
                  src={this.state.clickedBook[0].attributes.book.image}
                  alt="oh no"
                />
                <h2 className="searchBookTitle">
                  {this.state.clickedBook[0].attributes.book.title}
                  {this.state.clickedBook[0].attributes.book.subtitle &&
                    ":" +
                      " " +
                      this.state.clickedBook[0].attributes.book.subtitle}
                </h2>
                <h4>
                  by {this.state.clickedBook[0].attributes.book.authors}
                  <br />
                  Pages:{" "}
                  {this.state.clickedBook[0].attributes.book.printedPageCount}
                  <br />
                  Published:{" "}
                  {this.state.clickedBook[0].attributes.book.datePublished}
                  <br />
                  Categories:{" "}
                  {this.state.clickedBook[0].attributes.book.categories}
                  <br />
                  Original Language:{" "}
                  {this.state.clickedBook[0].attributes.book.language}
                </h4>
                <h4>{this.state.clickedBook[0].attributes.book.description}</h4>
                <div>
                  <h3>Your thoughts:</h3>

                  <div>
                    <textarea
                      className="typeYourThoughts"
                      id="expandable"
                      value={this.state.thoughts}
                      onChange={this.grabUserThoughts}
                      onKeyDown={this.handleKeyDown}
                      name="text"
                      oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'
                    />
                    <button
                      type="submit"
                      onClick={this.editBookThoughts}
                      className="submitThoughts"
                    >
                      Submit Thoughts
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div>
          <select className="chooseShelf" onChange={this.selectShelf}>
            {/* <datalist id="browsers"> */}
            <option value="" disabled selected>
              Shelves
            </option>
            <option value="Safari">Safari</option>
            <option value="Firefox">Firefox</option>
            <option value="Chrome">Chrome</option>
            <option value="All Books">All Books</option>
          </select>
        </div>
        <div>
          <select className="chooseSort" onChange={this.selectSort}>
            <option value="" disabled selected>
              Sort Books
            </option>
            <option value="Alphabetically">Alphabetically</option>
            {/* <option value="Page Count">Page Count</option> */}
            <option value="Date Added">Date Added</option>
            <option value="Author">Author</option>
            {/* <option value="Year Published">Year Published</option> */}
          </select>
        </div>
        <div>
          {/* {this.state.currentUserBooks.length > 0 ? ( */}
          <Bookshelf
            user_id={this.props.user_id}
            currentUserBooks={allLoadedUserBooks}
          />
          {/* ) : null} */}
        </div>
      </div>
    );
  }
}

export default HomePage;

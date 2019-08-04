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
    grabAllShelves: [],
    clickedBook: [],
    chosenShelf: "",
    sortMethod: "",
    thoughts: "",
    tags: ["all books"],
    value: "",
    shelves: ""
  };

  componentDidMount() {
    if (this.state.sortMethod.length < 1) {
      fetch(`http://localhost:3000/users/${this.props.user_id}`)
        .then(response => response.json())
        .then(userBooksData =>
          this.setState({
            currentUserBooks: userBooksData.data.attributes.user_books.sort(
              (a, b) => a.id - b.id
            ),
            grabAllShelves: userBooksData.data.attributes.user_books.sort(
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
    if (this.state.searchInput.length > 0) {
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
    }
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
          currentUserBooks: userBooksData.data.attributes.user_books.sort(
            (a, b) => a.id - b.id
          )
        })
      );
  };

  triggerBookSearch = event => {
    if (event.key === "Enter" && this.state.searchInput.length > 0) {
      this.searchForBooks();
    }
  };

  grabUserThoughts = event => {
    console.log(event.target);
    this.setState({
      thoughts: event.target.value
    });
  };

  resizeTextArea(e) {
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
          thoughts: clickedBookData.data.attributes.thoughts || "",
          shelves: [clickedBookData.data.attributes.shelves] || ""
        })
      );
  };

  closeClickedBookDisplay = () => {
    this.setState({
      clickedBook: []
    });
  };

  selectShelf = event => {
    // console.log(event.target.value);
    let shelfBooks = this.state.grabAllShelves.filter(
      userbook => userbook.shelves != null
    );
    if (event.target.value === "All Books") {
      this.setState({
        currentUserBooks: this.state.grabAllShelves
      });
    } else {
      this.setState({
        currentUserBooks: shelfBooks.filter(book =>
          book.shelves.includes(event.target.value)
        ),
        sortMethod: "shelf"
      });
    }
  };

  selectSort = event => {
    // console.log(event.target.value);
    // console.log(this.state.currentUserBooks);
    if (event.target.value === "Date Added") {
      this.setState({
        currentUserBooks: this.state.currentUserBooks.sort(
          (a, b) => a.id - b.id
        ),
        sortMethod: "date added"
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

  // IF YOU CONTROL Z BACK TO THIS YOU'RE GOOD
  handleChange = e => {
    this.setState({
      value: e.target.value
    });
  };

  handleKeyUp = e => {
    if (e.key === "Enter" || e.key === "Comma") {
      this.addTag();
    }
  };

  handleKeyDown = e => {
    if ((e.key === "Delete" || e.key === "Backspace") && !this.state.value) {
      this.editPrevTag();
    }
  };

  addTag = () => {
    const tag = this.state.value;

    if (!tag) {
      return;
    }
    let newShelves = this.state.shelves;
    if (this.state.shelves[0]) {
      newShelves.push(tag);
    } else {
      this.state.shelves[0] = tag;
    }

    newShelves = newShelves.join(", ");

    // console.log(this.state.shelves.push(tag));
    // let newShelves = this.state.shelves.push(tag).join(", ");

    fetch(`http://localhost:3000/user_books/${this.state.clickedBook[0].id}`, {
      method: "PATCH",
      headers: {
        Authorization: `${localStorage.token}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        shelves: newShelves
      })
    }).then(
      this.setState({
        clickedBook: this.state.clickedBook[0].attributes.shelves + tag,
        value: ""
      })
    );
  };

  // editPrevTag = () => {
  //   let tags = this.state.tags;

  //   const tag = tags.pop();

  //   this.setState({ value: tag });
  // };

  editPrevTag() {
    let tags = this.state.shelves;

    const tag = tags.pop();

    this.setState({ value: tag });
  }

  // changeShelves = event => {
  //   fetch(`http://localhost:3000/users/${this.props.user_id}`)
  //     .then(response => response.json())
  //     .then(userBooksData =>
  //       this.setState({
  //         currentUserBooks: userBooksData.data.attributes.user_books.filter(
  //           book => book.shelves.includes(event.target.value)
  //         ),
  //         sortMethod: "shelf"
  //       })
  //     );
  // };

  render() {
    // console.log(this.state.currentUserBooks.shelves);
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
    let listToFilter = this.state.grabAllShelves.map(book => book.shelves);
    let uniqueShelves = listToFilter.filter((v, i, a) => a.indexOf(v) === i);
    let shelves = uniqueShelves
      .filter(shelf => shelf != null)
      .map(shelf => shelf.split(", "))
      .flat()
      .filter((v, i, a) => a.indexOf(v) === i);

    console.log(listToFilter);
    // console.log(uniqueShelves);
    return (
      <div>
        <div className="banner">SHELF.</div>
        <div className="welcome">
          {/* <button className="logOut" /> */}
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
                      onKeyDown={this.resizeTextArea}
                      name="text"
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
                <h3>Assign this book to a shelf:</h3>
                <div className="form">
                  <div className="tags">
                    <ul>
                      {this.state.clickedBook[0].attributes.shelves
                        ? this.state.clickedBook[0].attributes.shelves
                            .split(", ")
                            .map((tag, i) => (
                              <li key={tag + i} className="tag">
                                {tag}
                              </li>
                            ))
                        : this.state.tags.map((tag, i) => (
                            <li key={tag + i} className="tag">
                              {tag}
                            </li>
                          ))}
                    </ul>
                    <input
                      type="text"
                      placeholder="Add a tag..."
                      value={this.state.value}
                      onChange={this.handleChange}
                      ref="tag"
                      className="tag-input"
                      onKeyUp={this.handleKeyUp}
                      onKeyDown={this.handleKeyDown}
                    />
                  </div>
                  <small>
                    Press <code>enter</code> to add a SHELF tag. Press{" "}
                    <code>backspace</code> to edit previous tag.
                  </small>
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
            <option value="All Books">All Books</option>
            {shelves.map(shelf => (
              <option value={`${shelf}`}>{`${shelf}`}</option>
            ))}
            {/* <option value="Safari">Safari</option>
            <option value="Firefox">Firefox</option>
            <option value="Chrome">Chrome</option>
            <option value="All Books">All Books</option> */}
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
            key={1}
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

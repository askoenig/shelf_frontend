// import { Link } from "react-router-dom";
import React from "react";
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
    clickedBook: false,
    chosenShelf: "",
    sortMethod: "",
    thoughts: "",
    tags: ["My Books"],
    value: "",
    shelves: "",
    toggleSearchButton: true,
    showMore: false
  };
  // if no sort method has been chosen, load all user_books
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
  // when a user deletes a book, delete it from SHELF API and update the bookshelf
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
      }).then(() => {
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
      });
  };

  grabSearchInput = event => {
    event.preventDefault();
    this.setState({
      searchInput: event.target.value
    });
  };
  // search the Google Books API and trigger getSearchBoxBooks to build SearchBooks
  searchForBooks = () => {
    if (this.state.searchInput.length > 0) {
      fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${this.state.searchInput}&printType=books&maxResults=30`
      )
        .then(response => response.json())
        .then(searchResults =>
          this.setState({
            displayBooks: searchResults.items
          })
        );
    }
  };
  // search logged in user user_books
  searchMyBooks = () => {
    if (this.state.searchInput) {
      this.setState({
        currentUserBooks: this.state.grabAllShelves.filter(book =>
          book.title
            .toLowerCase()
            .includes(this.state.searchInput.toLowerCase())
        ),
        sortMethod: "shelf",
        toggleSearchButton: false
      });
    }
  };

  refresh = () => {
    this.setState({
      toggleSearchButton: true,
      currentUserBooks: this.state.grabAllShelves
    });
  };

  getSearchBoxBooks = () => {
    const searchBoxBooks = this.state.displayBooks.map(book => (
      <SearchBook book={book} addBook={this.putSelectedBookOnShelf} />
    ));
    return searchBoxBooks;
  };

  closeSearchBookDisplay = () => {
    this.setState({
      displayBooks: []
    });
  };
  // triggered when a user clicks Add Book, updates bookshelf to add new book
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
  // enables search when user clicks enter key
  triggerBookSearch = event => {
    if (event.key === "Enter" && this.state.searchInput.length > 0) {
      this.searchForBooks();
    }
  };
  // show more functionality for longer book descriptions
  showMore = () => {
    if (!this.state.showMore) {
      this.setState({
        showMore: true
      });
    } else {
      this.setState({
        showMore: false
      });
    }
  };

  resetShowMore = () => {
    this.setState({
      showMore: false
    });
  };

  grabUserThoughts = event => {
    // console.log(event.target);
    this.setState({
      thoughts: event.target.value
    });
  };

  resizeTextArea(e) {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }
  // update user_book thoughts
  editBookThoughts = event => {
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
  // USE COMMENTED CODE BELOW/THROUGH OUT FOR REAL TIME CHARACTER BY CHARACTER SEARCH RESULTS

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
    // fetch data belonging to clickedBook
    fetch(`http://localhost:3000/user_books/${bookIdUserClicked}`)
      .then(response => response.json())
      .then(clickedBookData =>
        this.setState({
          clickedBook: [clickedBookData.data],
          thoughts: clickedBookData.data.attributes.thoughts || "",
          shelves: [clickedBookData.data.attributes.shelves] || "",
          tags: ["My Books"]
        })
      );
  };

  closeClickedBookDisplay = () => {
    this.setState({
      clickedBook: false
    });
  };
  // allow user to load a chosen shelf
  selectShelf = event => {
    let shelfBooks = this.state.grabAllShelves.filter(
      userbook => userbook.shelves != null
    );
    if (event.target.value === "My Books") {
      fetch(`http://localhost:3000/users/${this.props.user_id}`)
        .then(response => response.json())
        .then(userBooksData =>
          this.setState({
            currentUserBooks: userBooksData.data.attributes.user_books.sort(
              (a, b) => a.id - b.id
            ),
            chosenShelf: null
          })
        );
    } else {
      this.setState({
        currentUserBooks: shelfBooks.filter(book =>
          book.shelves.includes(event.target.value)
        ),
        chosenShelf: event.target.value,
        sortMethod: "shelf"
      });
    }
  };
  // when a user clicks a tag, the shelf belonging to that tag will load
  clickTag = tag => {
    let shelfBooks = this.state.grabAllShelves.filter(
      userbook => userbook.shelves != null
    );
    this.setState({
      currentUserBooks: shelfBooks.filter(book => book.shelves.includes(tag)),
      chosenShelf: tag.toString(),
      sortMethod: "shelf"
    });
  };
  // allow user to chose a sorting method
  selectSort = event => {
    if (event.target.value === "Date Added") {
      this.setState({
        currentUserBooks: this.state.currentUserBooks.sort(
          (a, b) => a.id - b.id
        ),
        sortMethod: "date added"
      });
    }
    if (event.target.value === "Alphabetically") {
      this.setState({
        currentUserBooks: this.state.currentUserBooks.sort((a, b) =>
          a.title.localeCompare(b.title)
        ),
        sortMethod: "alphabetically"
      });
    }
    if (event.target.value === "Author") {
      this.setState({
        currentUserBooks: this.state.currentUserBooks.sort((a, b) =>
          a.authors.localeCompare(b.authors)
        ),
        sortMethod: "author"
      });
    }
    // else if (event.target.value === "Page Count")
    // else if (event.target.value === "Date Published")
  };
  // track tag input
  handleChange = e => {
    this.setState({
      value: e.target.value
    });
  };

  handleKeyUp = e => {
    if (e.key === "Enter") {
      this.addTag();
    }
  };

  addTag = () => {
    let tag = this.state.value;

    if (!tag) {
      return;
    }
    let newShelves = this.state.shelves;
    if (this.state.shelves[0]) {
      newShelves.push(tag);
      newShelves = newShelves.join(", ");
      // } else if (this.state.tags != ["all books"]) {
      //   newShelves = this.state.tags;
      //   newShelves.push(tag);
      //   newShelves = newShelves.join(", ");
    } else newShelves = tag;

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
    })
      .then(() => {
        this.setState({
          shelves: [newShelves],
          tags: [newShelves],
          value: ""
        });
      })
      .then(() => {
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
      });
  };

  deleteTag = tag => {
    // console.log(tag);
    let newShelves = this.state.shelves
      .toString()
      .split(", ")
      .filter(shelf => shelf !== tag)
      .join(", ");
    // console.log([newShelves]);
    this.setState({
      shelves: [newShelves]
    });

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
    })
      .then(() => {
        this.setState({
          shelves: [newShelves],
          tags: [newShelves],
          value: ""
        });
      })
      .then(() => {
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
      });
  };

  logOut = () => {
    localStorage.clear();
    this.props.history.push("/login");
  };

  render() {
    // console.log("do it be like that?", this.state.showMore);
    console.log(this.state.chosenShelf);
    let allLoadedUserBooks;
    let ellipses;
    if (
      this.state.clickedBook &&
      !this.state.showMore &&
      this.state.clickedBook[0].attributes.book.description !== null
    ) {
      ellipses =
        this.state.clickedBook[0].attributes.book.description.substr(0, 600) +
        "...";
    } else if (this.state.clickedBook && this.state.showMore) {
      ellipses = this.state.clickedBook[0].attributes.book.description;
    } else ellipses = "No description was listed for this book";
    if (this.state.currentUserBooks.length > 0) {
      allLoadedUserBooks = this.state.currentUserBooks.map(book => {
        return (
          <Book
            book={book}
            grabID={this.getBookChoosenForRemoval}
            clickBook={this.displayClickedBookDetails}
            showMore={this.resetShowMore}
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

    // console.log(listToFilter);

    return (
      <div className="MainPage">
        <div className="banner">
          SHELF.
          {this.props.username && (
            <button className="logOut" onClick={this.logOut}>
              {" "}
              Log Out
            </button>
          )}
        </div>
        {this.state.chosenShelf ? (
          <div className="currentShelfOption2">{`${this.state.chosenShelf}`}</div>
        ) : null
        // <div className="currentShelfOption2">My Books</div>
        }
        <div className="welcome">
          {/* <button className="logOut" /> */}
          <h1> {this.props.username && `Hello, ${this.props.username}!`}</h1>
        </div>

        <div className="SearchBar">
          <input
            type="text"
            placeholder={"Search books by title, author, etc.."}
            // onChange={this.captureUserSearchInput}
            onChange={this.grabSearchInput}
            onKeyPress={this.triggerBookSearch}
          />

          <div className="ChooseSearch">
            <button className="searchOption" onClick={this.searchForBooks}>
              Search All Books
            </button>
            {this.state.toggleSearchButton ? (
              <button className="searchOption" onClick={this.searchMyBooks}>
                Search My Books
              </button>
            ) : null}
            {!this.state.toggleSearchButton ? (
              <button className="searchOption2" onClick={this.refresh}>
                Back To My Books
              </button>
            ) : null}
          </div>

          {this.state.displayBooks.length > 0 ? (
            <div className="bookSearchResults">
              <button
                className="closeSearchBookButton"
                onClick={this.closeSearchBookDisplay}
              >
                X
              </button>
              {this.getSearchBoxBooks()}
            </div>
          ) : null}

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
                <h4>
                  {/* {this.state.clickedBook[0].attributes.book.description} */}
                  {!this.state.showMore &&
                  this.state.clickedBook[0].attributes.book.description !==
                    null &&
                  this.state.clickedBook[0].attributes.book.description.length <
                    550
                    ? this.state.clickedBook[0].attributes.book.description
                    : ellipses}
                  {!this.state.showMore &&
                    this.state.clickedBook[0].attributes.book.description
                      .length > 550 && (
                      <button className="showMore" onClick={this.showMore}>
                        Show More
                      </button>
                    )}

                  {this.state.showMore &&
                    this.state.clickedBook[0].attributes.book.description.substr(
                      600
                    ) && <button onClick={this.showMore}>Show Less</button>}
                </h4>

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
                <div>
                  <div className="tags">
                    <ul>
                      {this.state.clickedBook[0].attributes.shelves
                        ? this.state.shelves
                            .toString()
                            .split(", ")
                            .map((tag, i) => (
                              <div
                                key={tag + i}
                                className="tag"
                                onClick={() => this.clickTag(tag)}
                              >
                                {tag}
                                <button
                                  className="deleteTag"
                                  onClick={() => this.deleteTag(tag)}
                                >
                                  X
                                </button>
                              </div>
                            ))
                        : this.state.tags.toString() !== "My Books"
                        ? this.state.tags
                            .toString()
                            .split(", ")
                            .map((tag, i) => (
                              <div key={tag + i} className="tag">
                                {tag}
                                <button
                                  className="deleteTag"
                                  onClick={() => this.deleteTag(tag)}
                                >
                                  X
                                </button>
                              </div>
                            ))
                        : this.state.tags.map((tag, i) => (
                            <div key={tag + i} className="tag">
                              {tag}
                            </div>
                          ))}
                    </ul>
                    <div className="typeTag">
                      <input
                        type="text"
                        placeholder="Add to Shelf.."
                        // value="Add tag.."
                        onChange={this.handleChange}
                        // className="typeTag"
                        onKeyUp={this.handleKeyUp}
                        onKeyDown={this.handleKeyDown}
                      />
                    </div>
                  </div>
                  <small>
                    Type and press <code>enter</code> to add a SHELF tag. Press{" "}
                    <code>X</code> to remove a tag.
                  </small>
                </div>
              </div>
            </div>
          )}
        </div>
        <div>
          <select
            className="chooseShelf"
            onClick={this.forceUpdate}
            onChange={this.selectShelf}
          >
            {/* <datalist id="browsers"> */}
            {this.state.chosenShelf ? (
              <option
                value={`${this.state.chosenShelf}`}
              >{`${this.state.chosenShelf}`}</option>
            ) : (
              <option value="" disabled selected>
                Shelves
              </option>
            )}
            <option value="My Books">My Books</option>
            {shelves
              .sort((a, b) => a.localeCompare(b))
              .map(shelf => (
                <option value={`${shelf}`}>{`${shelf}`}</option>
              ))}
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

import React, { Component } from "react";
// import Book from "./Book";
import "./Bookshelf.css";

export default class Bookshelf extends Component {
  // state = {
  //   currentUserBooks: ""
  // };

  // componentDidMount() {
  //   fetch(`http://localhost:3000/users/${this.props.user_id}`)
  //     .then(response => response.json())
  //     .then(userBooksData =>
  //       this.setState({
  //         currentUserBooks: userBooksData.data.attributes
  //       })
  //     );
  // }

  // getBookChoosenForRemoval = bookID => {
  //   fetch(`http://localhost:3000/user_books/${bookID}`, {
  //     method: "DELETE",
  //     headers: {
  //       Authorization: localStorage.token,
  //       "Content-Type": "application/json",
  //       Accept: "application/json"
  //     }
  //   });
  //   this.setState({
  //     currentUserBooks: {
  //       username: this.state.currentUserBooks.username,
  //       user_books: this.state.currentUserBooks.user_books.filter(
  //         user_book => user_book.id !== bookID
  //       )
  //     }
  //   });
  // };

  // allUserBooks = () => {
  //   const allLoadedUserBooks = this.state.currentUserBooks.user_books.map(
  //     book => {
  //       return (
  //         <Book
  //           book={book}
  //           // removeBook={this.removeBook}
  //           grabID={this.getBookChoosenForRemoval}
  //         />
  //       );
  //     }
  //   );
  //   return allLoadedUserBooks;
  // };

  render() {
    return <div className="bookshelf">{this.props.currentUserBooks}</div>;
  }
}

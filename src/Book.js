import React, { Component } from "react";

export default class Book extends Component {
  render() {
    return (
      <div>
        <div className="title">{this.props.title}</div>
        <div className="subtitle">{this.props.subtitle}</div>
        <img src={this.props.image} alt="oh no" />
        <div className="authors">{this.props.authors}</div>
        <div className="datePublished">{this.props.datePublished}</div>
        <div className="printedPageCount">{this.props.printedPageCount}</div>
        <div className="categories">{this.props.categories}</div>
        <div className="categories">{this.props.language}</div>
      </div>
    );
  }
}

//   t.string "googleBookId"
//   t.string "title"
//   t.string "subtitle"
//   t.string "authors"
//   t.string "datePublished"
//   t.string "printedPageCount"
//   t.string "categories"
//   t.string "language"
//   t.string "image"

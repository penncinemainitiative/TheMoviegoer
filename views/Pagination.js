import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';

class PageNumber extends Component {
  render() {
    var url = this.props.baseUrl + this.props.page;
    var selected = this.props.selected;
    return (
      <Button href={url} active={selected}>{this.props.page}</Button>
    );
  }
}

export default class Pagination extends Component {
  render() {
    var pageNumbers = [];
    for (var i = 1; i <= this.props.totalPages; i++) {
      pageNumbers.push({
        page: i,
        selected: i === this.props.page,
        baseUrl: this.props.baseUrl
      });
    }
    return (
      <div className="pagination">
        <ButtonGroup>
          {pageNumbers.map(function (pageNumber) {
            return (
              <PageNumber {...pageNumber}/>
            );
          })}
        </ButtonGroup>
      </div>
    );
  }
}
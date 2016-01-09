'use strict';

var React = require('react');
var Button = require('react-bootstrap').Button;
var ButtonGroup = require('react-bootstrap').ButtonGroup;

var PageNumber = React.createClass({
  render: function () {
    var url = this.props.baseUrl + this.props.page;
    var selected = this.props.selected;
    return (
      <Button href={url} active={selected}>{this.props.page}</Button>
    );
  }
});

var Pagination = React.createClass({
  render: function () {
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
});

module.exports = Pagination;
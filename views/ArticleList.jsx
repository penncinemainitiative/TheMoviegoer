'use strict';

var React = require('react');
var Table = require('react-bootstrap').Table;

var ArticleTable = React.createClass({
  render: function () {
    var currentAuthor = this.props.username;
    return (
      <Table responsive striped bordered condensed hover>
        <thead>
        <tr>
          <th>Title</th>
          <th>Last updated</th>
          <th>Assigned Editor</th>
          <th>Author</th>
          <th>Status</th>
          <th>Delete</th>
        </tr>
        </thead>
        <tbody>
        {this.props.articleList.map(function (article) {
          var deleteUrl = "/article/" + article.articleId + "/delete";
          var status;
          if (article.isPublished === -1) {
            status = "Not submitted";
          } else if (article.isPublished === 0) {
            status = "Submitted to editor";
          } else if (article.isPublished === 1) {
            status = "Submitted for final review";
          }
          return <tr>
            <td><a href={article.url}>{article.title}</a></td>
            <td>{article.updateDate}</td>
            <td>{article.assignedEditor}</td>
            <td>{article.authorname}</td>
            <td>{status}</td>
            <td>{currentAuthor === article.author ?
              <a href={deleteUrl}>Delete</a> : null}</td>
          </tr>;
        })}
        </tbody>
      </Table>
    );
  }
});

var ArticleList = React.createClass({
  render: function () {
    return (
      <div>
        <h3>Articles in Progress</h3>
        {this.props.articleList ? <ArticleTable {...this.props}/> : null}
      </div>
    );
  }
});

module.exports = ArticleList;
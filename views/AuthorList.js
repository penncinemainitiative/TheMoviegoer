import React, { Component } from 'react';
import Table from 'react-bootstrap/lib/Table';

class ArticleTable extends Component {
  render() {
    return (
      <Table responsive striped bordered condensed hover>
        <thead>
        <tr>
          <th>Author</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
        </thead>
        <tbody>
        {this.props.authors.map(function (author) {
          var approveUrl = '/writer/approve/' + author.username;
          var rejectUrl = '/writer/reject/' + author.username;
          var promoteUrl = '/writer/promote/' + author.username;
          var demoteUrl = '/writer/demote/' + author.username;
          var status = function () {
            if (author.isEditor === -1) {
              return <span><a href={approveUrl}>Approve</a> or <a href={rejectUrl}>Reject</a></span>;
            } else if (author.isEditor === 0) {
              return <span>Author (<a href={promoteUrl}>Promote</a>)</span>;
            } else if (author.isEditor === 1) {
              return <span>Assistant Editor (<a href={demoteUrl}>Demote</a>)</span>;
            } else {
              return "Editor-in-chief";
            }
          };
          var highlight = author.isEditor === -1 ? "alert-danger" : null;
          var authorEmail = "mailto:" + author.email;
          return <tr className={highlight}>
            <td>{author.name}</td>
            <td><a href={authorEmail}>{author.email}</a></td>
            <td>{status()}</td>
          </tr>;
        })}
        </tbody>
      </Table>
    );
  }
}

export default class AuthorList extends Component {
  render() {
    return (
      <div>
        <h3>Authors</h3>
        {this.props.authors ? <ArticleTable {...this.props}/> : null}
      </div>
    );
  }
}
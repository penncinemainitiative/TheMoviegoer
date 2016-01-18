'use strict';

var React = require('react');
var Table = require('react-bootstrap').Table;
var Input = require('react-bootstrap').Input;

var ArticleTable = React.createClass({
  render: function () {
    var editors = this.props.editors;
    return (
      <Table responsive striped bordered condensed hover>
        <thead>
        <tr>
          <th>Author</th>
          <th>Role</th>
          <th>Assigned Editor</th>
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
          var assignedEditor = function() {
            if (author.isEditor === 2) {
              return "N/A";
            }
            return editors.map(function(editor) {
              if (author.assignedEditor === editor.name) {
                return <Input checked type="radio" name={author.username} label={editor.name} value={editor.username}/>;
              } else if (author.name !== editor.name) {
                return <Input type="radio" name={author.username} label={editor.name} value={editor.username}/>;
              }
            });
          };
          return <tr>
            <td>{author.name}</td>
            <td>{status()}</td>
            <td className="assignedEditor">{assignedEditor()}</td>
          </tr>;
        })}
        </tbody>
      </Table>
    );
  }
});

var AuthorList = React.createClass({
  render: function () {
    return (
      <div>
        <h3>Authors</h3>
        {this.props.authors ? <ArticleTable {...this.props}/> : null}
      </div>
    );
  }
});

module.exports = AuthorList;
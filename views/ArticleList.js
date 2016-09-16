import React, { Component } from 'react';
import Table from 'react-bootstrap/lib/Table';

class ArticleTable extends Component {
  render() {
    var isHeadEditor = this.props.isEditor === 2;
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
          var authorEmail = "mailto:" + article.authorEmail;
          var editorEmail = "mailto:" + article.editorEmail;
          var title = {__html: article.title};
          return <tr data-articleid={article.articleId}>
            <td><a href={article.url} dangerouslySetInnerHTML={title}></a></td>
            <td>{article.updateDate}</td>
            <td>
              {isHeadEditor ?
                <div className="editorSelection">
                  <select data-articleid={article.articleId}
                          className="form-control chooseEditor">
                    <option
                      value={article.assignedEditor}>{article.assignedEditor}</option>
                  </select>
                </div> :
                <span>{article.assignedEditor} ({article.editorEmail ?
                  <a href={editorEmail}>{article.editorEmail}</a> :
                  <span>No email provided</span>
                })
                </span>
              }
            </td>
            <td>{article.authorname} ({article.authorEmail ?
              <a href={authorEmail}>{article.authorEmail}</a> :
              <span>No email provided</span>
            })
            </td>
            <td>{status}</td>
            <td>{currentAuthor === article.author ?
              <a className="deleteArticle"
                 href={deleteUrl}>Delete</a> : null}</td>
          </tr>;
        })}
        </tbody>
      </Table>
    );
  }
}

export default class ArticleList extends Component {
  render() {
    return (
      <div>
        <h3>Articles in Progress</h3>
        {this.props.articleList ? <ArticleTable {...this.props}/> : null}
      </div>
    );
  }
}
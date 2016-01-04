'use strict';

var React = require('react');
var Article = React.createClass({
  render: function() {
    var article = this.props;
    var deleteUrl = "/article/" + article.articleId + "/delete";
    return (
      <div className="row">
        <div
          className="col-lg-5 col-lg-offset-1 col-md-5 col-md-offset-1 col-xs-6">
          <a href={article.url} className="articleTitle">
            <img src={article.image} alt="Article image"
                 className="articleImg"/>
          </a>
        </div>
        <div className="col-lg-5 col-md-5 col-xs-6">
          <h4>
            <a href={article.url} className="articleTitle">
              {article.title}
            </a>
          </h4>
          <h5>{article.authorname}</h5>
          {article.isPublished === 2 ? (
            <h5>{article.pubDate}</h5>
          ) :
            <div>
              <h5>{article.updateDate}</h5>
              <a href={deleteUrl}>Delete
                article</a>
            </div>
          }
          {article.isPublished === 0 ? (
            <h5 className="goldh5">Saved Locally</h5>
          ) : null}
          {article.isPublished === 1 ? (
            <h5 className="goldh5">Submitted for Review</h5>
          ) : null}
        </div>
      </div>);
  }
});

var ArticleList = React.createClass({
  render: function () {
    return (
      <div>
        {this.props.articleList.map(function (article) {
          return <Article {...article}/>;
        })}
      </div>
    );
  }
});

module.exports = ArticleList;
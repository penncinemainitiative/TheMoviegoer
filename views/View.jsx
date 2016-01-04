'use strict';

var React = require('react');
var marked = require('marked');

var View = React.createClass({
  render: function () {
    var authorUrl = '/author/profile/' + this.props.author.replace(/\s+/g, '');
    var draftUrl = '/article/' + this.props.articleId + '/draft';
    var text = { __html: marked(this.props.text) };
    return (
      <div id="previewView">
        <header className="post-header">
          <h2 className="post-title">{this.props.title}</h2>
          <p className="post-meta">{this.props.date} &middot; <a
            href={authorUrl}>{this.props.author}</a>
            {this.props.isEditor === 1 ? (
              <span> &middot; <a href={draftUrl}>Edit Article</a></span>
            ) : null}
          </p>
        </header>
        <div className="col-lg-9 col-md-8 col-sm-8 col-xs-12">
          <img src={this.props.image} className="postimg"/>
          <div className="posttxt" dangerouslySetInnerHTML={text}></div>
        </div>
        <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12"></div>
      </div>
    );
  }
});

module.exports = View;
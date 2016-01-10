'use strict';

var React = require('react');
var marked = require('marked');
var Popular = require('./Popular');

var View = React.createClass({
  render: function () {
    var authorUrl = '/writer/' + this.props.author.replace(/\s+/g, '');
    var draftUrl = '/article/' + this.props.articleId + '/draft';
    var text = {__html: marked(this.props.text)};
    var title = {__html: this.props.title};
    return (
      <div id="previewView">
        <header className="post-header">
          <h2 className="post-title" dangerouslySetInnerHTML={title}></h2>
          <p className="post-meta">{this.props.date} &bull; <a
            href={authorUrl}>{this.props.author}</a>
            {this.props.isEditor === 1 ? (
              <span> &bull; <a href={draftUrl}>Edit Article</a></span>
            ) : null}
          </p>
        </header>
        <div className="row">
          <div className="col-lg-9 col-md-8 col-sm-8 col-xs-12">
            <img src={this.props.image} className="postimg"/>
            <div className="posttxt" dangerouslySetInnerHTML={text}></div>
          </div>
          {this.props.popularMovies ? (
            <Popular popularMovies={this.props.popularMovies} numPopular="3"/>
          ) : null}
        </div>
      </div>
    );
  }
});

module.exports = View;
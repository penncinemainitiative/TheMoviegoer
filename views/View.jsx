'use strict';

var React = require('react');
var marked = require('marked');
var Popular = require('./Popular');

var View = React.createClass({
  render: function () {
    var authorUrl = '/writer/' + this.props.author.replace(/\s+/g, '');
    var draftUrl = '/article/' + this.props.articleId + '/draft';
    var text = {__html: marked(this.props.text.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"))};
    var title = {__html: this.props.title};
    return (
      <div id="previewView">
        <div className="row">
          <div className="col-lg-9 col-md-8 col-sm-8 col-xs-12">
            <img src={this.props.image} className="largeImg postimg"/>
            <div className="postBody">
              <header className="post-header">
                <h2 className="post-title" dangerouslySetInnerHTML={title}></h2>
                <p className="post-meta"><span className="gold">{this.props.date} </span>&bull; <a
                  className="black" href={authorUrl}>{this.props.author}</a>
                  {this.props.isEditor === 2 ? (
                    <span> &bull; <a href={draftUrl}>Edit Article</a></span>
                  ) : null}
                </p>
              </header>
              <div className="posttxt" dangerouslySetInnerHTML={text}></div>
            </div>
            {this.props.children}
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
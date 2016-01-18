'use strict';

var React = require('react');
var Layout = require('./Layout');
var ArticleList = require('./ArticleList');
var AuthorList = require('./AuthorList');

var Home = React.createClass({
  render: function () {
    return (
      <Layout {...this.props}>
        <div id="home" className="container">
          <div className="title">Author Console</div>
          <h4>Welcome, {this.props.name}!</h4>
          <ArticleList {...this.props}/>
          { this.props.isEditor === 2 ? <AuthorList {...this.props}/> : null }
        </div>
      </Layout>
    );
  }
});

module.exports = Home;
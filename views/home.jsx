'use strict';

var React = require('react');
var Layout = require('./Layout.jsx');
var ArticleList = require('./ArticleList.jsx');

var AuthorRequest = React.createClass({
  render: function () {
    var url = '/author/approve/' + this.props.username;
    return (
      <p>{this.props.name} <a href={url}>Approve</a></p>
    );
  }
});

var Home = React.createClass({
  render: function () {
    var showAccountRequests = this.props.isEditor === 1 && this.props.pendingAuthors.length > 0;
    return (
      <Layout {...this.props}>
        <div id="home" className="container">
          <div className="title">Author Console</div>
          <h4>Welcome, {this.props.name}!</h4>
          { showAccountRequests ? (
            <div>
              <h5>Pending Account Requests</h5>
              {this.pendingAuthors.map(function (author) {
                return <AuthorRequest {...author}/>;
              })}
            </div>
          ) : null }
          <ArticleList {...this.props}/>
        </div>
      </Layout>
    );
  }
});

module.exports = Home;
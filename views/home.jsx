'use strict';

var React = require('react');
var Layout = require('./Layout');
var ArticleList = require('./ArticleList');

var AuthorRequest = React.createClass({
  render: function () {
    var approveUrl = '/writer/approve/' + this.props.username;
    var rejectUrl = '/writer/reject/' + this.props.username;
    return (
      <p>{this.props.name} <a href={approveUrl}>Approve</a> <a href={rejectUrl}>Reject</a>
      </p>
    );
  }
});

var Home = React.createClass({
  render: function () {
    var showAccountRequests = this.props.isEditor === 2 && this.props.pendingAuthors.length > 0;
    return (
      <Layout {...this.props}>
        <div id="home" className="container">
          <div className="title">Author Console</div>
          <h4>Welcome, {this.props.name}!</h4>
          { showAccountRequests ? (
            <div>
              <h5>Pending Account Requests</h5>
              {this.props.pendingAuthors.map(function (author) {
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
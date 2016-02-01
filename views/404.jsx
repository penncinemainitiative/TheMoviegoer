'use strict';

var React = require('react');
var Layout = require('./Layout');

var ErrorPage = React.createClass({
  render: function () {
    return (
      <Layout {...this.props}>
        <div className="title">Not Found</div>
      </Layout>
    );
  }
});

module.exports = ErrorPage;
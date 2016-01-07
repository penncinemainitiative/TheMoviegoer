'use strict';

var React = require('react');
var Layout = require('./Layout');
var View = require('./View');

var Article = React.createClass({
  render: function () {
    return (
      <Layout {...this.props}>
        <div className="container article">
          <View {...this.props}/>
        </div>
      </Layout>
    );
  }
});

module.exports = Article;
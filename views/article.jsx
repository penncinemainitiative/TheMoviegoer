'use strict';

var React = require('react');
var Layout = require('./Layout.jsx');
var View = require('./View.jsx');

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
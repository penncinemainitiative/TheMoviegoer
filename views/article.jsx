'use strict';

var React = require('react');
var Layout = require('./Layout');
var View = require('./View');

var Article = React.createClass({
  render: function () {
    return (
      <Layout {...this.props}>
        <div className="container article">
          <View {...this.props}>
            <div className="fb-comments" data-href={this.props.url}
                 data-width="100%" data-numposts="5"></div>
          </View>
        </div>
      </Layout>
    );
  }
});

module.exports = Article;
'use strict';

var React = require('react');
var Layout = require('./Layout.jsx');
var IndexReviews = require('./IndexReviews.jsx');

var Index = React.createClass({
  render: function () {
    return (
      <Layout {...this.props}>
        <div className="title">The Moviegoer</div>
        <IndexReviews {...this.props}/>
        <div id="screening-banner">
          <div id="pcisub"><h2 className="fancy"><span>Next Screening</span></h2></div>
          <div className="container">
            <div className="row">
            </div>
          </div>
        </div>
      </Layout>
    );
  }
});

module.exports = Index;
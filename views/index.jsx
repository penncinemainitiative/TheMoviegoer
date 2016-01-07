'use strict';

var React = require('react');
var Layout = require('./Layout.jsx');
var IndexReviews = require('./IndexReviews.jsx');
var Row = require('react-bootstrap').Row;

var Index = React.createClass({
  render: function () {
    return (
      <Layout {...this.props}>
        <div className="title">The Moviegoer</div>
        <IndexReviews {...this.props}/>
        <div id="screening-banner">
          <div id="pcisub"><h2 className="fancy"><span>Next Screening</span>
          </h2></div>
          <div className="container">
            <Row>
              <div className="col-lg-9 col-md-8 col-sm-8 col-xs-12">
                {this.props.nextEvent ? (
                  <img src={this.props.nextEvent.image}/>
                ) : <h4>No upcoming events!</h4>
                }
              </div>
            </Row>
          </div>
        </div>
      </Layout>
    );
  }
});

module.exports = Index;
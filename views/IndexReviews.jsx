'use strict';

var React = require('react');
var SideBar = require('./SideBar.jsx');
var TopStory = require('./TopStory.jsx');

var IndexReviews = React.createClass({
  render: function () {
    this.props.features[1]['size'] = 'half';
    this.props.features[2]['size'] = 'half';
    this.props.movies[1]['size'] = 'half';
    this.props.movies[2]['size'] = 'half';
    return (
      <div className="wrapper">
        <div id="feature-content">
          <div className="container">
            <div className="row">
              <div className="col-lg-9 col-md-8 col-sm-8 col-xs-12">
                <TopStory {...this.props.features[0]}/>
                <TopStory {...this.props.features[1]}/>
                <TopStory {...this.props.features[2]}/>
              </div>
              <SideBar name="Popular"/>
            </div>
          </div>
        </div>

        <div id="movie-content">
          <div id="pcisubwhite"><h2 className="fancy fancywhite">
            <span>Reviews</span></h2></div>
          <div className="container">
            <div className="row">
              <SideBar name="Upcoming Events"/>
              <div className="col-lg-9 col-md-8 col-sm-8 col-xs-12">
                <TopStory {...this.props.movies[0]}/>
                <TopStory {...this.props.movies[1]}/>
                <TopStory {...this.props.movies[2]}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = IndexReviews;
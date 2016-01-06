'use strict';

var React = require('react');
var Layout = require('./Layout.jsx');
var SideBar = require('./SideBar.jsx');
var TopStory = require('./TopStory.jsx');
var Pagination = require('./Pagination.jsx');

var Movies = React.createClass({
  render: function () {
    return (
      <Layout {...this.props}>
        <div id="movie-content" className="container">
          <div className="title white">Movies</div>
          <Pagination {...this.props}/>
          <div id="movies" className="container">
            <div className="row">
              <SideBar name="New Releases" size="half">
                {this.props.newReleases.map(function (movie) {
                  return <TopStory {...movie}/>;
                })}
              </SideBar>
              <SideBar name="Old Releases" size="half">
                {this.props.oldReleases.map(function (movie) {
                  return <TopStory {...movie}/>;
                })}
              </SideBar>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
});

module.exports = Movies;
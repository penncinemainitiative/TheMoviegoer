import React, { Component } from 'react';
import SideBar from './SideBar';
import Popular from './Popular';
import TopStory from './TopStory';
import UpcomingEvents from './UpcomingEvents';

export default class IndexReviews extends Component {
  render() {
    this.props.movies[0]['classes'] = 'largeImg';
    this.props.features[0]['classes'] = 'largeImg';
    this.props.features[1]['size'] = 'half';
    this.props.features[2]['size'] = 'half';
    this.props.movies[1]['size'] = 'half';
    this.props.movies[2]['size'] = 'half';
    return (
      <div>
        <div id="feature-content">
          <div className="container">
            <div className="row">
              <div className="col-lg-9 col-md-8 col-sm-8 col-xs-12">
                <TopStory {...this.props.features[0]}/>
                <TopStory {...this.props.features[1]}/>
                <TopStory {...this.props.features[2]}/>
              </div>
              <Popular popularMovies={this.props.popularMovies} numPopular="3"/>
            </div>
          </div>
        </div>

        <div id="movie-content">
          <div id="pcisubwhite"><h2 className="fancy fancywhite">
            <span>Reviews</span></h2></div>
          <div className="container">
            <div className="row">
              <UpcomingEvents events={this.props.upcomingEvents}/>
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
}
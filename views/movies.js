import React, { Component } from 'react';
import Layout from './Layout';
import SideBar from './SideBar';
import TopStory from './TopStory';
import Pagination from './Pagination';

export default class Movies extends Component {
  render() {
    return (
      <Layout {...this.props}>
        <div id="movie-content" className="container">
          <div className="title white">Movies</div>
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
          <Pagination {...this.props}/>
        </div>
      </Layout>
    );
  }
}

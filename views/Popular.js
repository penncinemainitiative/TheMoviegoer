import React, { Component } from 'react';
import SideBar from './SideBar';

class Article extends Component {
  render() {
    var movie = this.props;
    var authorUrl = '/writer/' + movie.authorname.replace(/\s+/g, '');
    var title = {__html: movie.title};
    return (
      <div className="event col-lg-12 col-md-12 col-sm-12 col-xs-4">
        <a href={movie.url}><img
          alt="Popular article"
          src={movie.image}/></a>
        <div className="popularTitle">
          <a href={movie.url} className="black"
             dangerouslySetInnerHTML={title}/>
          <h4>
            <small>{movie.pubDate} <a href={authorUrl}>{movie.authorname}</a>
            </small>
          </h4>
        </div>
      </div>
    );
  }
}

export default class Popular extends Component {
  render() {
    var numPop = this.props.numPopular;
    var popularMovies = this.props.popularMovies.slice(0, numPop);
    return (
      <SideBar name="Popular">
        {popularMovies ? popularMovies.map(function (movie) {
          if (movie && Object.keys(movie).length !== 0) {
            return <Article {...movie}/>;
          }
        }) : null}
      </SideBar>
    );
  }
}
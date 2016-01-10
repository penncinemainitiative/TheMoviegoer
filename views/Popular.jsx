'use strict';

var React = require('react');
var SideBar = require('./SideBar');

var Article = React.createClass({
  render: function () {
    var movie = this.props;
    var authorUrl = '/writer/' + movie.authorname.replace(/\s+/g, '');
    var title = {__html: movie.title};
    return (
      <div className="event col-lg-12 col-md-12 col-sm-12 col-xs-4">
        <a href={movie.url}><img
          src={movie.image}/></a>
        <a href={movie.url} className="black" dangerouslySetInnerHTML={title}/>
        <h4>
          <small>{movie.pubDate} <a href={authorUrl}>{movie.authorname}</a>
          </small>
        </h4>
      </div>
    );
  }
});

var Popular = React.createClass({
  render: function () {
    var numPop = this.props.numPopular;
    var popularMovies = this.props.popularMovies.slice(0, numPop);
    return (
      <SideBar name="Popular">
        {popularMovies.map(function (movie) {
          return <Article {...movie}/>;
        })}
      </SideBar>
    );
  }
});

module.exports = Popular;
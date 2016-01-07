'use strict';

var React = require('react');
var SideBar = require('./SideBar');
var dateFormat = require('dateformat');

var Event = React.createClass({
  render: function () {
    var movie = this.props;
    var title = {__html: movie.title};
    var hours = movie.time.split(':')[0];
    var mins = movie.time.split(':')[1];
    movie.date.setHours(hours, mins);
    var date = dateFormat(movie.date, "dddd, mmmm dS, yyyy • h:MM TT");
    return (
      <div className="event col-lg-12 col-md-12 col-sm-12 col-xs-4">
        <a target="_blank" href={movie.fbLink}><img
          src={movie.image}/></a>
        <h5 href={movie.url} dangerouslySetInnerHTML={title}/>
        <h4><small>{date} • {movie.location}</small></h4>
      </div>
    );
  }
});

var Popular = React.createClass({
  render: function () {
    var events = this.props.events.slice(0,3);
    return (
      <SideBar name="Upcoming Events">
        {events ? events.map(function (event) {
          return <Event {...event}/>;
        }) : null}
      </SideBar>
    );
  }
});

module.exports = Popular;
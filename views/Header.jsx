'use strict';

var React = require('react');
var Row = require('react-bootstrap').Row;

var HeaderItem = React.createClass({
  render: function () {
    return (
      <div className='headerItem col-lg-1 col-md-1 col-sm-1 col-xs-2'>
        <h5><a href={this.props.url}>{this.props.name}</a></h5>
      </div>
    );
  }
});

var SearchBar = React.createClass({
  render: function () {
    return (
      <div className='searchBar col-lg-3 col-md-3 col-sm-3 col-xs-8 col-lg-offset-0 col-md-offset-0 col-sm-offset-0'>
        <select id="search" className="form-control"/>
      </div>
    );
  }
});

var Header = React.createClass({
  render: function () {
    var items;
    if (this.props.inConsole) {
      items = [
        {name: 'Home', url: '/console/home'},
        {name: 'Profile', url: '/writer/profile'},
        {name: 'Events', url: '/events'},
        {name: 'New Article', url: '/article'}
      ];
    } else {
      items = [
        {name: 'Features', url: '/features'},
        {name: 'Movies', url: '/movies'},
        {name: 'Events', url: '/events'},
        {name: 'About', url: '/about'}
      ];
    }
    return (
      <div id="header">
        <Row>
          <div
            className="logo col-lg-1 col-md-2 col-sm-2 col-xs-3 col-lg-offset-2 col-md-offset-1 col-sm-offset-1">
            <a href="/" id="headerTitle"><img src="/images/logo.png"
                                              alt="The Moviegoer"/></a>
          </div>
          <HeaderItem {...items[0]}/>
          <HeaderItem {...items[1]}/>
          <HeaderItem {...items[2]}/>
          <HeaderItem {...items[3]}/>
          <SearchBar/>
        </Row>
      </div>
    );
  }
});

module.exports = Header;
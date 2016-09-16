import React, { Component } from 'react';
import Row from 'react-bootstrap/lib/Row';

class HeaderItem extends Component {
  render() {
    return (
      <div className='headerItem col-lg-1 col-md-1 col-sm-1 col-xs-2'>
        <h5><a href={this.props.url}>{this.props.name}</a></h5>
      </div>
    );
  }
}

class SearchBar extends Component {
  render() {
    return (
      <div className='searchBar col-lg-3 col-md-3 col-sm-3 col-xs-8 col-lg-offset-0 col-md-offset-0 col-sm-offset-0'>
        <select id="search" className="form-control"/>
      </div>
    );
  }
}

export default class Header extends Component {
  render() {
    var items;
    if (this.props.inConsole) {
      items = [
        {name: 'Home', url: '/console/home'},
        {name: 'Profile', url: '/writer/profile'},
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
          {items.map(function (item) {
            return <HeaderItem {...item}/>;
          })}
          <SearchBar/>
        </Row>
      </div>
    );
  }
}
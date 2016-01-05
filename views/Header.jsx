'use strict';

var React = require('react');
var Row = require('react-bootstrap').Row;

var HeaderItem = React.createClass({
  render: function () {
    var classes = 'col-lg-2 col-md-2 col-sm-2 col-xs-2';
    if (this.props.first) {
      classes = [classes, 'col-lg-offset-1', 'col-md-offset-1', 'col-sm-offset-1', 'col-xs-offset-1'].join(' ');
    }
    return (
      <div className={classes}>
        <h5><a href={this.props.url}
               className="headerItem">{this.props.name}</a></h5>
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
        {name: 'Profile', url: '/author/profile'},
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
    items[0]['first'] = true;
    return (
      <div id="header">
        <div className="container-fluid">
          <Row>
            <HeaderItem {...items[0]}/>
            <HeaderItem {...items[1]}/>
            <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
              <h5><a href="/" id="headerTitle"><img src="/images/logo.png"
                                                    alt="The Moviegoer"
                                                    className="logo"/></a></h5>
            </div>
            <HeaderItem {...items[2]}/>
            <HeaderItem {...items[3]}/>
          </Row>
        </div>
      </div>
    );
  }
});

module.exports = Header;
'use strict';

var React = require('react');

var SideBar = React.createClass({
  render: function () {
    var classes;
    if (this.props.size === 'full') {
      classes = 'col-lg-12 col-md-12 col-sm-12 col-xs-12';
    } else if (this.props.size === 'half') {
      classes = 'col-lg-6 col-md-6 col-sm-6 col-xs-12';
    } else {
      classes = 'col-lg-3 col-md-4 col-sm-4 col-xs-12';
    }
    return (
      <div className={classes}>
        <div className="sidebar">
          {this.props.name ? <div className="upcomingBar">
            <h4>{this.props.name}</h4>
          </div> : null}
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = SideBar;
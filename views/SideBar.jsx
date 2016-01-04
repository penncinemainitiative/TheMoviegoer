'use strict';

var React = require('react');

var SideBar = React.createClass({
  render: function () {
    var classes;
    if (this.props.size === 'half') {
      classes = 'col-lg-6 col-md-6 col-sm-6 col-xs-12';
    } else {
      classes = 'col-lg-3 col-md-4 col-sm-4 col-xs-12';
    }
    return (
      <div className={classes}>
        <div className="sidebar">
          <div className="upcomingBar">
            <h4>{this.props.name}</h4>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SideBar;
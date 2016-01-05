'use strict';

var React = require('react');
var SideBar = require('./SideBar.jsx');

var Popular = React.createClass({
  render: function () {
    var numPop = parseInt(this.props.numPopular);
    return (
      <SideBar name="Popular">
      </SideBar>
    );
  }
});

module.exports = Popular;
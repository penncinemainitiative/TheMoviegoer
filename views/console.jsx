'use strict';

var React = require('react');
var Layout = require('./Layout');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

var Console = React.createClass({
  render: function () {
    return (
      <Layout {...this.props}>
        <div id="console" className="container">
          <div className="title">Login</div>
          <Input type="text" id="inputEmail" placeholder="Username"/>
          <Input type="password" id="inputPassword" placeholder="Password"/>
          <Button type="submit" id="loginBtn">Login</Button>
          <Button href="/console/signup">Become an author!</Button>
          <div id="issue" className="alert alert-danger" role="alert"></div>
        </div>
      </Layout>
    );
  }
});

module.exports = Console;
'use strict';

var React = require('react');
var Layout = require('./Layout');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var Alert = require('react-bootstrap').Alert;

var Console = React.createClass({
  render: function () {
    return (
      <Layout {...this.props}>
        <div id="console" className="container">
          <div className="title">Login</div>
          <form id="loginForm">
            <Input name="username" type="text" placeholder="Username"/>
            <Input name="password" type="password" placeholder="Password"/>
            <Button type="submit">Login</Button>
            <Button href="/console/signup">Become an author!</Button>
          </form>
          <Alert bsStyle="danger"/>
        </div>
      </Layout>
    );
  }
});

module.exports = Console;
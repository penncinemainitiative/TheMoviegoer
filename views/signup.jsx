'use strict';

var React = require('react');
var Layout = require('./Layout');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var Alert = require('react-bootstrap').Alert;

var Signup = React.createClass({
  render: function () {
    return (
      <Layout {...this.props}>
        <div id="console" className="container">
          <div className="title">Become an author!</div>
          <form id="signupForm">
            <Input type="email" name="email" placeholder="Email"/>
            <Input type="text" name="name" placeholder="Name"/>
            <Input type="text" name="username" placeholder="Username"/>
            <Input type="password" name="password" placeholder="Password"/>
            <Input type="password" name="passwordConfirm"
                   placeholder="Confirm password"/>
            <Button type="submit">Sign up</Button>
          </form>
          <Alert bsStyle="danger"/>
        </div>
      </Layout>
    );
  }
});

module.exports = Signup;
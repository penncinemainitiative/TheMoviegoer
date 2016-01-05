'use strict';

var React = require('react');
var Layout = require('./Layout.jsx');
var Input = require('react-bootstrap').Input;

var Signup = React.createClass({
  render: function () {
    return (
      <Layout {...this.props}>
        <div id="console" className="container">
          <div className="title">Become an author!</div>
          <Input type="email" id="inputEmail" placeholder="Email"/>
          <Input type="text" id="inputName" placeholder="Name"/>
          <Input type="text" id="inputUser" placeholder="Username"/>
          <Input type="password" id="inputPassword" placeholder="Password"/>
          <Input type="password" id="inputPasswordConfirm"
                 placeholder="Confirm password"/>
          <Button type="submit" id="signupBtn">Sign up</Button>
          <div id="issue" className="alert alert-danger" role="alert"
               align="center"
               hidden></div>
        </div>
      </Layout>
    );
  }
});

module.exports = Signup;
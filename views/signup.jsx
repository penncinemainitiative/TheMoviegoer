'use strict';

var React = require('react');
var Layout = require('./Layout.jsx');

var Signup = React.createClass({
  render: function () {
    return (
      <Layout {...this.props}>
        <div id="console" className="container">
          <div className="title">Become an author!</div>
          <input type="email" className="form-control" id="inputEmail"
                 placeholder="Email"
                 onKeyPress="if (event.charCode == 13) document.getElementById('loginBtn').click();"/>
          <input type="text" className="form-control" id="inputName"
                 placeholder="Name"
                 onKeyPress="if (event.charCode == 13) document.getElementById('loginBtn').click();"/>
          <input type="email" className="form-control" id="inputUser"
                 placeholder="Username"
                 onKeyPress="if (event.charCode == 13) document.getElementById('loginBtn').click();"/>
          <input type="password" className="form-control" id="inputPassword"
                 placeholder="Password"
                 onKeyPress="if (event.charCode == 13) document.getElementById('loginBtn').click();"/>
          <input type="password" className="form-control" id="inputPasswordConfirm"
                 placeholder="Confirm password"
                 onKeyPress="if (event.charCode == 13) document.getElementById('loginBtn').click();"/>
          <button type="submit" className="btn btn-default btn-sm" id="signupBtn">
            Sign up
          </button>
          <div id="issue" className="alert alert-danger" role="alert" align="center"
               hidden></div>
        </div>
      </Layout>
    );
  }
});

module.exports = Signup;
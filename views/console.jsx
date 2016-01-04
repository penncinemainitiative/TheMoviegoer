'use strict';

var React = require('react');
var Layout = require('./Layout.jsx');

var Console = React.createClass({
  render: function () {
    return (
      <Layout {...this.props}>
        <div id="console" className="container">
          <div className="title">Login</div>
          <input type="email" className="form-control" id="inputEmail"
                 placeholder="Username"
                 onKeyPress="if (event.charCode == 13) document.getElementById('loginBtn').click();"/>
          <input type="password" className="form-control" id="inputPassword"
                 placeholder="Password"
                 onKeyPress="if (event.charCode == 13) document.getElementById('loginBtn').click();"/>
          <button type="submit" className="btn btn-default btn-sm"
                  id="loginBtn">Login
          </button>
          <a className="btn btn-default btn-sm" href="/console/signup">Become an
            author!</a>
          <div id="issue" className="alert alert-danger" role="alert"></div>
        </div>
      </Layout>
    );
  }
});

module.exports = Console;
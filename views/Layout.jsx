'use strict';

var React = require('react');
var Header = require('./Header.jsx');
var Footer = require('./Footer.jsx');

var Layout = React.createClass({
  render: function () {
    return (
      <html>
      <head>
        <title>{this.props.title}</title>
        <link rel="stylesheet"
              href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"/>
        <link rel="stylesheet"
              href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css"/>
        <script
          src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
        <script
          src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
        <link rel="shortcut icon" href="/images/favicon.png"/>
        <link rel="stylesheet" type="text/css" href="/css/style.min.css"/>
      </head>
      <body>
      <div id="notFooter">
        <Header {...this.props}/>
        <div id="content">
          {this.props.children}
        </div>
      </div>
      <Footer {...this.props}/>
      <script type="text/javascript" src="/js/page.js"></script>
      </body>
      </html>
    );
  }
});

module.exports = Layout;
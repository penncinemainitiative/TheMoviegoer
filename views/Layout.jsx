'use strict';

var React = require('react');
var Header = require('./Header');
var Footer = require('./Footer');

var Layout = React.createClass({
  render: function () {
    return (
      <html>
      <head>
        <title>{this.props.title.replace(/(<([^>]+)>)/ig, "")}</title>
        <link rel="stylesheet"
              href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"/>
        <link rel="stylesheet"
              href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css"/>
        <script
          src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
        <script
          src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.1/css/select2.min.css"
          rel="stylesheet"/>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.1/js/select2.min.js"></script>
        <link rel="shortcut icon" href="/images/favicon.png"/>
        <link rel="stylesheet" type="text/css" href="/css/style.min.css"/>

        <meta property="fb:app_id" content="132619720416789"/>
        <meta property="fb:admins" content="brad.pettigrew"/>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
      </head>
      <body>
      <script src="/js/fbSDK.js"></script>
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
'use strict';

var React = require('react');
var Row = require('react-bootstrap').Row;

var FooterItem = React.createClass({
  render: function () {
    return (
      <a className="footerItem" href={this.props.url}>{this.props.text}</a>
    );
  }
});

var Footer = React.createClass({
  render: function () {
    return (
      <div id="footer">
        <div className="container">
          <Row>
            <div className="col-sm-offset-1 col-sm-10">
              <p>The Moviegoer is a student-run blog dedicated to film
                appreciation - posting film analyses, reviews, previews, and all
                things related.
                We seek to build a film community on-campus and online through
                collaboration as well as other PCI-sponsored initiatives. If you
                would like to work with us, please find out more under the <a
                  href="/about">about</a> tab. Penn Cinema Initiative is
                generously sponsored by the <a target="_blank"
                                    href="http://cinemastudies.sas.upenn.edu/">
                  University of Pennsylvania Cinema Studies Department</a> and <a
                  target="_blank" href="http://harrison.house.upenn.edu/">
                  Harrison College House</a>.</p>
            </div>
          </Row>
          <a
            href="http://www.facebook.com/pages/Penn-Cinema-Initiative/1536055873314021"><img
            src="/images/facebook-logo.png" alt="Facebook"/></a>
        </div>
        <div>
          &copy; Penn Cinema Initiative <br/>
          {this.props.inConsole ? (
            <FooterItem url="/" text="Go to The Moviegoer"/>
          ) :
            <FooterItem url="/console" text="Go to Author Console"/>
          }
          {this.props.login ? (
            <FooterItem url="/console/logout" text="Logout"/>
          ) : null }
        </div>
      </div>
    );
  }
});

module.exports = Footer;
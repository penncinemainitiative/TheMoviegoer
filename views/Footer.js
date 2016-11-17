import React, { Component } from 'react';
import Row from 'react-bootstrap/lib/Row';

class FooterItem extends Component {
  render() {
    return (
      <a className="footerItem" href={this.props.url}>{this.props.text}</a>
    );
  }
}

export default class Footer extends Component {
  render() {
    return (
      <div id="footer">
        <div className="container">
          <Row>
            <div className="col-sm-offset-1 col-sm-10">
              <p>The Moviegoer is a student-run blog dedicated to film
                appreciation - posting film analyses, reviews, previews, and all
                things related.
                If you
                would like to work with us, please find out more under the <a
                  href="/about">about</a> tab. The Moviegoer is
                generously sponsored by the <a target="_blank"
                                    href="http://www.writing.upenn.edu/wh/">
                  The Kelly Writers House</a> at the University of Pennsylvania.</p>
            </div>
          </Row>
          <a
            href="http://www.facebook.com/pages/Penn-Cinema-Initiative/1536055873314021"><img
            src="/images/facebook-logo.png" alt="Facebook"/></a>
          <div>
            &copy; Penn Cinema Initiative <br/>
            Webmaster: dlakata (at) seas (dot) upenn (dot) edu<br/>
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
      </div>
    );
  }
}
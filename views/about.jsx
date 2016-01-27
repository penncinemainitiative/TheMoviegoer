'use strict';

var React = require('react');
var Layout = require('./Layout');
var Row = require('react-bootstrap').Row;

var About = React.createClass({
  render: function () {
    return (
      <Layout {...this.props}>
        <div id="about" className="container">
          <div className="title">About</div>
          <Row>
            <div className="col-md-10 col-md-offset-1 col-xs-12" id="pci-description">
              <p>Penn Cinema Initiative is proud to present <i>The Moviegoer</i>.</p>

              <p>Penn Cinema Initiative (PCI) is a student group at the University of
                Pennsylvania dedicated to growing a film community on campus through
                weekly screenings as well as other club-sponsored events. This year, PCI
                is dedicated to the Penn Year of Discovery, focusing on black and white
                and foreign films in its screening schedule.</p>

              <p><i>The Moviegoer</i> is a student-run blog dedicated to film
                appreciation - posting film analyses, reviews, previews, and all things
                related. We are a platform for students to learn about film and to learn
                to write about film. As such, we encourage those interested in writing
                to reach out to us.</p>

              <p>If you would like to work with <i>The Moviegoer</i>, either by writing
                for us or by aiding in web development, please contact our Lead Editor,
                Brad Pettigrew (bradpett at sas dot upenn).</p>

              <p>If you are interested in getting involved with PCI, either through
                presenting a film or working with the club in general, please contact
                Club President Nikhil Venkatesa (vnikhil at sas dot upenn).</p>

              <p>Penn Cinema Initiative is generously sponsored by the <a target="_blank" href="http://cinemastudies.sas.upenn.edu/">
                  University of Pennsylvania Cinema Studies Department</a> and <a target="_blank" href="http://harrison.house.upenn.edu/">
                Harrison College House</a>.</p>
            </div>
            <img src="https://scontent-cdg2-1.xx.fbcdn.net/hphotos-xfa1/t31.0-8/s960x960/1890590_1536326326620309_6231478269899912810_o.jpg"/>
          </Row>
        </div>
      </Layout>
    );
  }
});

module.exports = About;
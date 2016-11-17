import React, { Component } from 'react';
import Layout from './Layout';
import Row from 'react-bootstrap/lib/Row';

export default class About extends Component {
  render() {
    return (
      <Layout {...this.props}>
        <div id="about" className="container">
          <Row>
            <div className="col-md-5 col-md-offset-1 col-xs-12" id="pci-description">
              <div className="title">About</div>
              <p><i>The Moviegoer</i> is a student-run blog dedicated to film
                appreciation - posting film analyses, reviews, previews, and all things
                related. We are a platform for students to learn about film and to learn
                to write about film. As such, we encourage those interested in writing
                to reach out to us.</p>

              <p>If you would like to work with <i>The Moviegoer</i>, either by writing
                for us or by aiding in web development, please contact our Editor-in-Chief,
                Brad Pettigrew (bradpett at sas dot upenn).</p>

              <p><i>The Moviegoer</i> is generously sponsored by the <a target="_blank" href="http://www.writing.upenn.edu/~wh/">
                Kelly Writers House</a>.</p>
            </div>
            <div className="col-md-5 col-md-offset-1 col-xs-12" id="staff">
              <div className="title">Staff</div>
              <ul>
                <li><b>Editor-in-Chief:</b> Brad Pettigrew</li>
                <li><b>Managing Editor:</b> Rahel Tekeste</li>
                <li><b>Head Copyeditor:</b> Soubie Im</li>
                <li><b>Head of Press Outreach:</b> Ritwik Bhatia</li>
                <li><b>Treasurer:</b> Nikhil Venkatesa</li>
                <li><b>Social Chair:</b> Lacy Wright</li>
              </ul>
            </div>
            <div className="col-md-5 col-md-offset-1 col-xs-12" id="contact">
              <div className="title">Contact Us</div>
              <p>If you would like to work with <i>The Moviegoer</i>, either by writing
                for us or by aiding in web development, please contact our Editor-in-Chief,
                Brad Pettigrew (bradpett at sas dot upenn).</p>
            </div>
          </Row>
        </div>
      </Layout>
    );
  }
}
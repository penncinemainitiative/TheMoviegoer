import React, { Component } from 'react';
import Layout from './Layout';
import IndexReviews from './IndexReviews';
import dateFormat from 'dateformat';
import Row from 'react-bootstrap/lib/Row';

export default class Index extends Component {
  render() {
    var nextScreening = this.props.upcomingEvents[0];
    var hours = nextScreening.time.split(':')[0];
    var mins = nextScreening.time.split(':')[1];
    nextScreening.date.setHours(hours, mins);
    var date = dateFormat(nextScreening.date, "dddd, mmmm dS, yyyy • h:MM TT");
    return (
      <Layout {...this.props}>
        <div className="title">The Moviegoer</div>
        <IndexReviews {...this.props}/>
        <div id="screening-banner">
          <div id="pcisub"><h2 className="fancy"><span>Next Screening</span>
          </h2></div>
          <div className="container">
            <Row>
              {this.props.upcomingEvents ? (
                <div>
                  <div className="col-lg-8 col-md-8 col-sm-6 col-xs-12">
                    <a target="_blank" href={nextScreening.fbLink}><img alt="Next screening" src={nextScreening.image}/></a>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <h4>Meet the Penn Cinema Initiative at our next screening
                      of</h4>
                    <h3><i>{nextScreening.film}</i></h3>
                    <h3>
                      <small>{date}</small>
                    </h3>
                    <h3>
                      <small>{nextScreening.location}</small>
                    </h3>
                  </div>
                </div>
              ) : <h4>No upcoming events!</h4>
              }
            </Row>
          </div>
        </div>
      </Layout>
    );
  }
}
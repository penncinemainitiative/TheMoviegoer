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
        <div className="title"></div>
        <IndexReviews {...this.props}/>
      </Layout>
    );
  }
}
import React, { Component } from 'react';
import Layout from './Layout';
import EventModal from './EventModal';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

class Event extends Component {
  render() {
    var event = this.props;
    return (
      <div className="row">
        {event.isEditor === 2 ?
          <div>
            <Button className="deleteEvent" data-articleid={event.eventId}>
              <Glyphicon glyph="edit"/> Delete event
            </Button>
            <Button className="editEvent" data-articleid={event.eventId}
                    data-toggle="modal"
                    data-target=".event-modal">
              <Glyphicon glyph="edit"/> Edit event
            </Button>
          </div> : null}
        <a target="_blank" href={event.fbLink}><img alt={event.title} src={event.image}/></a>
      </div>
    );
  }
}

export default class Events extends Component {
  render() {
    var isEditor = this.props.isEditor;
    return (
      <Layout {...this.props}>
        <div id="events" className="container">
          <div className="title">Events</div>
          {isEditor === 2 ? (
            <Button id="createEvent" data-toggle="modal"
                    data-target=".event-modal">
              <Glyphicon glyph="edit"/> Create event</Button>
          ) : null}
          {this.props.events.map(function (event) {
            event.isEditor = isEditor;
            return <Event {...event}/>;
          })}
        </div>
        {isEditor === 2 ? <EventModal/> : null}
      </Layout>
    );
  }
}
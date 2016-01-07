'use strict';

var React = require('react');
var Layout = require('./Layout');
var EventModal = require('./EventModal');
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;

var Event = React.createClass({
  render: function () {
    var event = this.props;
    return (
      <div className="row">
        {event.isEditor ?
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
        <a target="_blank" href={event.fbLink}><img src={event.image}/></a>
      </div>
    );
  }
});

var Events = React.createClass({
  render: function () {
    var isEditor = this.props.isEditor;
    return (
      <Layout {...this.props}>
        <div id="events" className="container">
          <div className="title">Events</div>
          {isEditor === 1 ? (
            <Button id="createEvent" data-toggle="modal"
                    data-target=".event-modal">
              <Glyphicon glyph="edit"/> Create event</Button>
          ) : null}
          {this.props.events.map(function (event) {
            event.isEditor = isEditor;
            return <Event {...event}/>;
          })}
        </div>
        <EventModal/>
      </Layout>
    );
  }
});

module.exports = Events;
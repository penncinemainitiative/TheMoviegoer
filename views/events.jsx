'use strict';

var React = require('react');
var Layout = require('./Layout.jsx');
var EventModal = require('./EventModal.jsx');

var Events = React.createClass({
  render: function () {
    return (
      <Layout {...this.props}>
        <div id="events" className="container">
          <div className="title">Features</div>
          {this.props.isEditor === 1 ? (
            <button type="submit" className="btn btn-default btn-sm"
                    id="eventBtn"
                    data-toggle="modal" data-target=".event-modal">
              <span className="glyphicon glyphicon-edit" aria-hidden="true"> </span>
              Create event
            </button>
          ) : null}
          {this.props.events.map(function (event) {
            return (
              <div className="row">
                <img src={event.image}/>
              </div>
            );
          })}
        </div>
        <EventModal/>
      </Layout>
    );
  }
});

module.exports = Events;
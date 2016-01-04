'use strict';

var React = require('react');

var EventModal = React.createClass({
  render: function () {
    return (
      <div className="modal fade event-modal" tabIndex="-1" role="dialog"
           aria-labelledby="myLargeModalLabel" align="center">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button id="closeModalBtn" type="button" className="close"
                      data-dismiss="modal" aria-label="Close"><span
                aria-hidden="true">&times;</span></button>
              <h4 className="modal-title" id="myModalLabel">New Event</h4>
            </div>
            <div className="modal-body">
              <div id="text" className="alert alert-danger" role="alert"
                   align="center" hidden></div>
              <form role="form" action="/events/create" method="post"
                    encType="multipart/form-data"
                    onerror="window.location='/events'" id="eventForm">
                <input type="file" id="fileInput" name="photo"/>
                <input className="btn btn-default" type="submit" value="Submit"
                       id="submitPhotoBtn"/>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = EventModal;
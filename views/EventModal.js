import React, { Component } from 'react';
import Input from 'react-bootstrap/lib/Input';
import Alert from 'react-bootstrap/lib/Alert';
import Button from 'react-bootstrap/lib/Button';

export default class EventModal extends Component {
  render() {
    return (
      <div className="modal fade event-modal" tabIndex="-1" role="dialog" align="center">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button id="closeModalBtn" type="button" className="close"
                      data-dismiss="modal" aria-label="Close"><span
                aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">Event</h4>
            </div>
            <div className="modal-body">
              <form method="post" action="/events/create"
                    encType="multipart/form-data" id="eventForm">
                <Input type="text" name="title" placeholder="Title"/>
                <Input type="text" name="film" placeholder="Film"/>
                <Input type="text" name="fbLink" placeholder="Facebook link"/>
                <Input type="text" name="location" placeholder="Location"/>
                <Input type="text" name="description"
                       placeholder="Description"/>
                <Input type="time" name="time"/>
                <Input type="date" name="date"/>
                Photo: <Input type="file" id="photo" name="photo" accept=".jpg,.jpeg,.png"/>
                <Button type="submit">Submit</Button>
              </form>
              <Alert bsStyle="danger"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
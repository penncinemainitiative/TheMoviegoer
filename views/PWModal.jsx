'use strict';

var React = require('react');

var EventModal = React.createClass({
  render: function () {
    return (
      <div className="modal fade pw-change-modal" tabIndex="-1" role="dialog"
           aria-labelledby="myLargeModalLabel" align="center">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button id="closeModalBtn" type="button" className="close"
                      data-dismiss="modal" aria-label="Close"><span
                aria-hidden="true">&times;</span></button>
              <h4 className="modal-title" id="myModalLabel">Change Password</h4>
            </div>
            <div className="modal-body">
              <br/>
              <input type="password" className="form-control pwinput" id="oldpw"
                     placeholder="Old Password"
                     onKeyPress="if (event.keyCode == 13) document.getElementById('pwcBtn').click();"/>
              <br/>
              <input type="password" className="form-control pwinput" id="newpw1"
                     placeholder="New Password"
                     onKeyPress="if (event.keyCode == 13) document.getElementById('pwcBtn').click();"/>
              <br/>
              <input type="password" className="form-control pwinput" id="newpw2"
                     placeholder="Re-type New Password"
                     onKeyPress="if (event.keyCode == 13) document.getElementById('pwcBtn').click();"/>
              <br/>
              <div id="issueModal" className="alert alert-danger" role="alert"
                   align="center" hidden></div>
              <button type="button" className="btn btn-default btn-danger btn-sm"
                      id="pwcBtn">Change
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = EventModal;
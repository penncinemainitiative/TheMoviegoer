'use strict';

var React = require('react');

var EventModal = React.createClass({
  render: function () {
    var uploadUrl = '/article/' + this.props.articleId + '/photos';
    return (
      <div className="modal fade img-upload-modal" tabIndex="-1" role="dialog"
           aria-labelledby="myLargeModalLabel" align="center">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button id="closeModalBtn" type="button" className="close"
                      data-dismiss="modal" aria-label="Close"><span
                aria-hidden="true">&times;</span></button>
              <h4 className="modal-title" id="myModalLabel">Upload Image</h4>
            </div>
            <div className="modal-body">
              <div className="profileImg">
                <img
                  src="https://www.royalacademy.org.uk/assets/placeholder-1e385d52942ef11d42405be4f7d0a30d.jpg"
                  id="profileImg"/>
              </div>
              <form role="form" action={uploadUrl}
                    method="post" encType="multipart/form-data"
                    onError="window.location='/author/profile'" id="photoForm">
                <input type="text" value={this.props.articleId} name="articleId"/>
                <input type="file" id="fileInput" name="photo"/>
                <input className="btn btn-default" type="submit" value="Submit"
                       id="submitPhotoBtn"/>
              </form>
              <div id="issueModal" className="alert alert-danger" role="alert"
                   align="center" hidden></div>
              <button type="button" className="btn btn-default btn-sm"
                      id="modalImgUpload">Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = EventModal;
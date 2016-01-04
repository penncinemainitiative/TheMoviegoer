'use strict';

var React = require('react');
var Layout = require('./Layout.jsx');
var TopStory = require('./TopStory.jsx');
var PWModal = require('./PWModal.jsx');

var EditButtons = React.createClass({
  render: function () {
    return (
      <div>
        <button type="submit" className="btn btn-default btn-sm"
                id="editBtn"><span className="glyphicon glyphicon-edit"
                                   aria-hidden="true"> </span> Edit bio
        </button>
        <button type="submit" className="btn btn-default btn-sm"
                id="pwBtn" data-toggle="modal"
                data-target=".pw-change-modal"><span
          className="glyphicon glyphicon-edit" aria-hidden="true"> </span>
          Change Password
        </button>
        <button type="submit" className="btn btn-default btn-sm"
                id="updateProfile">Save
        </button>
      </div>
    );
  }
});

var Alert = React.createClass({
  render: function () {
    return (
      <div className="row">
        <div className="col-sm-6"></div>
        <div className="col-sm-6"><br/><br/>
          <div className="alert alert-success alert-dismissible"
               role="alert" id="saveAlert" hidden>
            <button type="button" className="close" data-dismiss="alert"
                    aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
            Your password has been <strong>changed</strong>!
          </div>
          <div id="issue" className="alert alert-danger" role="alert"
               align="center" hidden></div>
        </div>
      </div>
    );
  }
});

var BioImage = React.createClass({
  render: function () {
    return (
      <div className="row">
        <div className="col-lg-4 col-sm-4 col-xs-5">
          <div className="profileImg">
            {this.props.inConsole ? (<p>Click on the image to update</p>) : null }
            <img src={this.props.image} id="profileImg"/>
            {this.props.inConsole ? (
              <form role="form" action="/author/profile/picture" method="post"
                    id="photoForm" encType="multipart/form-data">
                <input type="file" id="fileInput" name="photo"/>
                <input type="submit" value="Submit" id="submitPhotoBtn"/>
              </form>
            ) : null}
          </div>
        </div>
        <div className="col-lg-8 col-sm-8 col-xs-7">
          <p id="profileBio">{this.props.bio}</p>
          {this.props.inConsole ? (
            <div>
              <input type="text" className="form-control" id="inputName"
                     value={this.props.name}
                     onKeyPress="if (event.charCode == 13) document.getElementById('loginBtn').click()"/>
              <input type="text" className="form-control" id="inputEmail"
                     value={this.props.email}
                     onKeyPress="if (event.charCode == 13) document.getElementById('loginBtn').click();"/>
              <textarea className="form-control" rows="4" id="inputBio"
                        onKeyPress="if (event.charCode == 13) document.getElementById('loginBtn').click();">{this.props.bio}</textarea>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
});

var Profile = React.createClass({
  render: function () {
    return (
      <Layout {...this.props}>
        <div id="profile" className="container">
          <div className="title">
            <h2>
              <small>Articles by</small>
              <br/>
              {this.props.name}</h2>
          </div>
          <div id="bioImage">
            {this.props.inConsole ? (
              <EditButtons/>
            ) : null}
            <BioImage {...this.props}/>
          </div>
          <Alert/>
          <div className="row">
            {this.props.moviesList.map(function (article) {
              article['size'] = 'third';
              return <TopStory {...article}/>;
            })}
          </div>
        </div>
        <PWModal/>
      </Layout>
    );
  }
});

module.exports = Profile;
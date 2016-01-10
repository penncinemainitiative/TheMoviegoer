'use strict';

var React = require('react');
var Layout = require('./Layout');
var TopStory = require('./TopStory');
var PWModal = require('./PWModal');
var Row = require('react-bootstrap').Row;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;

var EditButtons = React.createClass({
  render: function () {
    return (
      <div>
        <Button type="submit" id="editBtn"><Glyphicon glyph="edit"/>
          Edit bio</Button>
        <Button type="submit" id="pwBtn" data-toggle="modal"
                data-target=".pw-change-modal"><Glyphicon glyph="edit"/>
          Change Password</Button>
        <Button type="submit" id="updateProfile">Save</Button>
      </div>
    );
  }
});

var Alert = React.createClass({
  render: function () {
    return (
      <Row>
        <div className="col-sm-6"></div>
        <div className="col-sm-6"><br/><br/>
          <div className="alert alert-success alert-dismissible"
               role="alert" id="saveAlert" hidden>
            <Button className="close" data-dismiss="alert"
                    aria-label="Close"><span
              aria-hidden="true">&times;</span></Button>
            Your password has been <strong>changed</strong>!
          </div>
          <div id="issue" className="alert alert-danger" role="alert"
               align="center" hidden></div>
        </div>
      </Row>
    );
  }
});

var BioImage = React.createClass({
  render: function () {
    return (
      <Row>
        <div className="col-lg-4 col-sm-4 col-xs-12">
          <div className="profileImg">
            {this.props.inConsole ? (<p>Click on the image to update</p>) : null }
            <img src={this.props.image} id="profileImg"/>
            {this.props.inConsole ? (
              <form role="form" action="/writer/profile/picture" method="post"
                    id="photoForm" encType="multipart/form-data">
                <Input type="file" id="fileInput" name="photo"/>
                <Input type="submit" value="Submit" id="submitPhotoBtn"/>
              </form>
            ) : null}
          </div>
        </div>
        <div className="col-lg-8 col-sm-8 col-xs-12">
          <p id="profileBio">{this.props.bio}</p>
          {this.props.inConsole ? (
            <div>
              <Input type="text" id="inputName" placeholder="Name" value={this.props.name}/>
              <Input type="text" id="inputEmail" placeholder="Email" value={this.props.email}/>
              <Input type="textarea" placeholder="Bio" rows="6" id="inputBio">{this.props.bio}</Input>
            </div>
          ) : null}
        </div>
      </Row>
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
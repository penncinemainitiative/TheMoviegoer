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
        <Button type="submit" id="profilePicBtn"><Glyphicon glyph="edit"/>
          Change Picture</Button>
        <Button type="submit" id="updateProfile">Save</Button>
      </div>
    );
  }
});

var Alert = React.createClass({
  render: function () {
    return (
      <div>
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
    );
  }
});

var BioImage = React.createClass({
  render: function () {
    return (
      <Row>
        <div className="col-lg-4 col-sm-4 col-xs-12">
          <div className="profileImg">
            <img alt="Profile image" src={this.props.image} id="profileImg"/>
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
              <Input type="text" id="inputName" placeholder="Name"
                     value={this.props.name}/>
              <Input type="email" id="inputEmail" placeholder="Email"
                     value={this.props.email}/>
              <Input type="textarea" placeholder="Bio" rows="6"
                     id="inputBio">{this.props.bio}</Input>
            </div>
          ) : null}
          <Alert/>
        </div>
      </Row>
    );
  }
});

var AuthorMovies = React.createClass({
  render: function () {
    var rows = [];
    var articles = this.props.moviesList.map(function (article) {
      article['size'] = 'third';
      return <TopStory {...article}/>;
    });
    for (var i = 0; i < Math.ceil(this.props.moviesList.length / 3); i++) {
      rows.push(<Row>{articles.slice(i * 3, i * 3 + 3)}</Row>);
    }
    return (<div>{rows}</div>);
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
            {this.props.inConsole ? (
              <EditButtons/>
            ) : null}
          </div>
          <Row id="bioImage">
            <BioImage {...this.props}/>
          </Row>
          <AuthorMovies {...this.props}/>
        </div>
        {this.props.inConsole ? <PWModal/> : null}
      </Layout>
    );
  }
});

module.exports = Profile;
import React, { Component } from 'react';
import Layout from './Layout';
import TopStory from './TopStory';
import PWModal from './PWModal';
import Row from 'react-bootstrap/lib/Row';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

class EditButtons extends Component {
  render() {
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
}

class Alert extends Component {
  render() {
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
}

class BioImage extends Component {
  render() {
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
}

class AuthorMovies extends Component {
  render() {
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
}

export default class Profile extends Component {
  render() {
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
}
'use strict';

var React = require('react');
var Layout = require('./Layout');
var View = require('./View');
var Input = require('react-bootstrap').Input;
var Row = require('react-bootstrap').Row;
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;
var SideBar = require('./SideBar');
var dateFormat = require('dateformat');

var ActionButtons = React.createClass({
  render: function () {
    var showSubmit = this.props.isEditor !== 2 && this.props.isPublished === -1;
    var showFinalReview = this.props.isEditor === 1 && this.props.isPublished === 0;
    var showPublish = this.props.isEditor === 2 && this.props.isPublished !== 2;
    var showRetract = this.props.isEditor === 2 && this.props.isPublished === 2;
    return (
      <div id="editButtons">
        <Button id="editBtn">Edit</Button>
        <Button id="saveBtn">Save</Button>
        <Button id="prevBtn">Preview</Button>
        {showSubmit ? <Button id="submBtn">Submit</Button> : null }
        {showFinalReview ?
          <Button id="finalReviewBtn">Final review</Button> : null }
        {showPublish ? <Button id="publBtn">Publish</Button> : null }
        {showRetract ? <Button id="retractBtn">Retract</Button> : null }
      </div>
    );
  }
});

var PhotoForm = React.createClass({
  render: function () {
    var uploadUrl = '/article/' + this.props.articleId + '/photos';
    var onError = "window.location='/article/" + this.props.articleId + "'";
    return (
      <form role="form" action={uploadUrl}
            method="post" encType="multipart/form-data"
            onError={onError} id="photoForm">
        <input type="file" id="photoInput" name="photo"
               accept=".jpg,.jpeg,.png"/>
      </form>);
  }
});

var DraftForm = React.createClass({
  render: function () {
    var uploadUrl = '/article/' + this.props.articleId + '/draft';
    var onError = "window.location='/article/" + this.props.articleId + "'";
    return (
      <form role="form" action={uploadUrl}
            method="post" encType="multipart/form-data"
            onError={onError} id="draftForm">
        <input type="file" id="draftInput" name="photo" accept=".doc,.docx"/>
      </form>);
  }
});

var Drafts = React.createClass({
  render: function () {
    return (
      <SideBar name="Drafts" size="full">
        {this.props.drafts ? this.props.drafts.map(function (draft) {
          var date = dateFormat(draft.date, "m/dd/yy • h:MM TT");
          return (
            <p><a href={draft.url}>Uploaded by {draft.uploader}</a><br/>{date}
            </p>
          );
        }) : null}
        <DraftForm {...this.props}/>
      </SideBar>
    )
  }
});

var Uploads = React.createClass({
  render: function () {
    return (
      <SideBar>
        <Images {...this.props}/>
        <Drafts {...this.props}/>
      </SideBar>
    )
  }
});

var Images = React.createClass({
  render: function () {
    var cover = this.props.image;
    return (
      <SideBar name="Images" size="full">
        {this.props.imgList.map(function (image, i) {
          var picNumber = i + 1;
          var imgString = '![Picture ' + picNumber + '](' + image.image + ')';
          return (
            <div className="newImageDiv">
              <img src={image.image} className="newImage"
                   alt="Picture"/>
              <div className="input-group">
                <Input type="text" value={imgString}
                       onClick="this.select();"/>
                      <span className="input-group-btn">
                        {cover === image.image ? (
                          <Button className="btn-primary starBtn"
                                  value={image.image}>
                            <Glyphicon glyph="star"/> Cover
                          </Button>
                        ) :
                          <Button className="starBtn" value={image.image}>
                            <Glyphicon glyph="star"/> Cover
                          </Button>
                        }
                      </span>
              </div>
            </div>
          );
        })}
        <PhotoForm {...this.props}/>
      </SideBar>);
  }
});

var Article = React.createClass({
  render: function () {
    return (
      <Layout {...this.props}>
        <div id="draft" className="container">
          <div className="title">Editing
            <ActionButtons {...this.props}/>
          </div>
          <div className="alert alert-success alert-dismissible" role="alert"
               id="saveAlert" hidden>
            <button type="button" className="close" data-dismiss="alert"
                    aria-label="Close"><span aria-hidden="true">&times;</span>
            </button>
            The article has been <strong>saved</strong>!
          </div>
          <div id="issue" className="alert alert-danger" role="alert"
               align="center"
               hidden></div>
          <Row id="editView">
            <div className="col-lg-9 col-md-8 col-sm-6">
              <Input type="text" id="titleInput"
                     label="Title (use HTML tags like <i></i> or <b></b> for style)"
                     placeholder="Article Title" value={this.props.title}/>
              <Input type="text" id="excerptInput"
                     label="Excerpt"
                     placeholder="Excerpt" value={this.props.excerpt}/>
              {this.props.isEditor === 2 ?
                <span>
                  <label htmlFor="authorInput">Author</label>
                  <select id="authorInput" className="form-control">
                    <option
                      value={this.props.author}>{this.props.author}</option>
                  </select>
                </span> : null}
              <div id="typeRadioVal" hidden>{this.props.type}</div>
              <Input type="radio" name="typeInput" id="featureRadio"
                     label="Feature Article"
                     value="feature" checked/>
              <Input type="radio" name="typeInput" id="newmovieRadio"
                     label="New Release Movie"
                     value="newmovie"/>
              <Input type="radio" name="typeInput" id="oldmovieRadio"
                     label="Old Release Movie"
                     value="oldmovie"/>
              <Input type="textarea" rows="14" placeholder="Article Text..."
                     label="Text (use Markdown for style)"
                     id="textInput" value={this.props.text}/>
            </div>
            <Uploads {...this.props}/>
          </Row>
          <View {...this.props}/>
        </div>
      </Layout>
    );
  }
});

module.exports = Article;
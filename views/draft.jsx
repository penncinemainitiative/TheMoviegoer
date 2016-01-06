'use strict';

var React = require('react');
var Layout = require('./Layout.jsx');
var View = require('./View.jsx');
var ImageModal = require('./ImageModal.jsx');
var Input = require('react-bootstrap').Input;
var Row = require('react-bootstrap').Row;
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;

var ActionButtons = React.createClass({
  render: function () {
    return (
      <div>
        <Button id="editBtn">Edit</Button>
        <Button id="saveBtn">Save</Button>
        <Button id="prevBtn">Preview</Button>
        {this.props.isPublished === 0 ? (
          <Button id="submBtn">Submit</Button>
        ) : null}
        {this.props.isEditor === 1 ? (
          <span>
            <Button id="publBtn">Publish</Button>
            <Button id="retractBtn">Retract</Button>
          </span>
        ) : null}
      </div>
    );
  }
});

var Article = React.createClass({
  render: function () {
    var cover = this.props.image;
    return (
      <Layout {...this.props}>
        <div id="draft" className="container">
          <div className="title">Editing</div>
          <Row id="editView">
            <div className="col-lg-9 col-md-8 col-sm-6">
              <Input type="text" id="headInput"
                     label="Title (use HTML tags like <i></i> or <b></b> for style)"
                     placeholder="Article Title" value={this.props.title}/>
              <Input type="text" id="excerptInput"
                     label="Excerpt"
                     placeholder="Excerpt" value={this.props.excerpt}/>
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
                     label="Use Markdown for style"
                     id="textInput" value={this.props.text}/>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <p>Images</p>
              {this.props.imgList.map(function (image, i) {
                var imgString = '<img src="' + image.image + '" class="newImage" alt="Picture"/>';
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
                            <Glyphicon glyph="star"/>
                          </Button>
                        ) :
                          <Button className="starBtn" value={image.image}>
                            <Glyphicon glyph="star"/>
                          </Button>
                        }
                      </span>
                    </div>
                  </div>
                );
              })}
              <button type="button" className="btn btn-default"
                      data-toggle="modal" data-target=".img-upload-modal"
                      id="imgUploadBtn">
                <span className="glyphicon glyphicon-upload"
                      aria-hidden="true"> </span>
              </button>
            </div>
          </Row>
          <View {...this.props}/>
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
          <ActionButtons {...this.props}/>
        </div>
        <ImageModal{...this.props}/>
      </Layout>
    );
  }
});

module.exports = Article;
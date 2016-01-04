'use strict';

var React = require('react');
var Layout = require('./Layout.jsx');
var View = require('./View.jsx');
var ImageModal = require('./ImageModal.jsx');

var ActionButtons = React.createClass({
  render: function () {
    return (
      <div>
        <button type="submit" className="btn btn-default btn-sm" id="editBtn">
          Edit
        </button>
        <button type="submit" className="btn btn-default btn-sm" id="saveBtn">
          Save
        </button>
        <button type="submit" className="btn btn-default btn-sm" id="prevBtn">
          Preview
        </button>
        {this.props.isPublished === 0 ? (
          <button type="submit" className="btn btn-default btn-sm" id="submBtn">
            Submit</button>
        ) : null}
        {this.props.isEditor === 1 ? (
          <span>
              <button type="submit" className="btn btn-default btn-sm"
                      id="publBtn">Publish
              </button>
              <button type="submit" className="btn btn-default btn-sm"
                      id="retractBtn">
                Retract
              </button>
          </span>
        ) : null}
      </div>
    );
  }
});

var Article = React.createClass({
  render: function () {
    var captionList = this.props.captionList;
    var cover = this.props.cover;
    return (
      <Layout {...this.props}>
        <div id="draft" className="container">
          <div className="title">Editing</div>
          <div className="row" id="editView">
            <div className="col-lg-9 col-md-8 col-sm-6">
              <input type="text" className="form-control" id="headInput"
                     placeholder="Article Title" value={this.props.title}/>
              <br/>
              <div id="typeRadioVal" hidden>{this.props.type}</div>
              <div className="radio">
                <label>
                  <input type="radio" name="typeInput" id="featureRadio"
                         value="feature" checked/>
                  Feature Article
                </label>
              </div>
              <div className="radio">
                <label>
                  <input type="radio" name="typeInput" id="newmovieRadio"
                         value="newmovie"/>
                  New Release Movie
                </label>
              </div>
              <div className="radio">
                <label>
                  <input type="radio" name="typeInput" id="oldmovieRadio"
                         value="oldmovie"/>
                  Old Release Movie
                </label>
              </div>
              <br/>
              <textarea className="form-control" rows="14"
                        placeholder="Article Text..." id="textInput">
                {this.props.text}
              </textarea>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <p>Images</p>
              {this.props.imgList.map(function (image, i) {
                var imgString = '<img src=' + image +  'className="newImage" alt=' + captionList[i];
                var numImg = i + ';' + image;
                return (
                  <div className="newImageDiv">
                    <img src={image} className="newImage"
                         alt={captionList[i]}/>
                    <div className="input-group">
                      <input type="text" className="form-control"
                             value={imgString}
                             onClick="this.select();"/>
                      <span className="input-group-btn">
                        {cover === i ? (
                          <button className="btn btn-default btn-primary starBtn"
                                  type="button" value={numImg}>
                          <span className="glyphicon glyphicon-star"
                                aria-hidden="true"> </span></button>
                        ) :
                          <button className="btn btn-default starBtn" type="button"
                                  value={numImg}><span
                            className="glyphicon glyphicon-star"
                            aria-hidden="true"> </span></button>
                        }
                      </span>
                    </div>
                  </div>
                );
              })}
              <button type="button" className="btn btn-default" data-toggle="modal" data-target=".img-upload-modal" id="imgUploadBtn">
                <span className="glyphicon glyphicon-upload" aria-hidden="true"> </span>
              </button>
            </div>
          </div>
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
        <ImageModal {...this.props}/>
      </Layout>
    );
  }
});

module.exports = Article;
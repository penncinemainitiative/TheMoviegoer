import React from "react"
import {asyncConnect} from "redux-connect"
import {
  getDraft,
  changeArticleAuthor,
  changeArticleType,
  saveArticle,
  publishArticle,
  setCoverPhoto,
  retractArticle,
  updatePhoto,
  updatePodcast
} from "../../api/article"
import Helmet from "react-helmet"
import ArticleView from "../ArticleView"
import AudioPlayer from "../AudioPlayer"
import browserHistory from "react-router/lib/browserHistory"
import Dropzone from "react-dropzone"
import jwt_decode from "jwt-decode"
import Select from "react-select"
import {allAuthors} from "../../api/index"
import SimpleMDE from "react-simplemde-editor"

const types = [
  {value: "podcast", label: "Podcast"},
  {value: "article", label: "Article"}
];

@asyncConnect([{
    key: 'draft',
    promise: ({store: {getState}, params}) => getDraft(getState().token, params.id)
  }, {
    key: 'authors',
    promise: () => allAuthors()
  }],
  state => ({token: state.token})
)
export default class Draft extends React.Component {
  constructor(props) {
    super(props);
    this.updateTitle = this.updateTitle.bind(this);
    this.updateType = this.updateType.bind(this);
    this.updateAuthor = this.updateAuthor.bind(this);
    this.updateExcerpt = this.updateExcerpt.bind(this);
    this.updateText = this.updateText.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.handlePublish = this.handlePublish.bind(this);
    this.handleCoverPhoto = this.handleCoverPhoto.bind(this);
    this.handleRetractArticle = this.handleRetractArticle.bind(this);
    this.handleExit = this.handleExit.bind(this);
    this.onDropImage = this.onDropImage.bind(this);
    this.onDropPodcast = this.onDropPodcast.bind(this);
    const {draft} = this.props;
    this.state = {
      title: draft.title,
      excerpt: draft.excerpt,
      author: draft.author,
      text: draft.text,
      image: draft.image,
      name: draft.name,
      pubDate: draft.pubDate,
      articleId: draft.articleId,
      type: draft.type,
      podcast: draft.podcast,
      preview: false,
      uploadProgress: 0,
      message: ''
    };
  }

  updateTitle(e) {
    this.setState(Object.assign({}, this.state, {title: e.target.value}));
  }

  updateType(clicked) {
    const type = clicked.value;
    const {params, token} = this.props;
    changeArticleType(token, params.id, type).then(() => {
      this.setState(Object.assign({}, this.state, {type}));
    });
  }

  updateAuthor(clicked) {
    const author = clicked.value;
    const name = clicked.label;
    const {params, token} = this.props;
    changeArticleAuthor(token, params.id, author).then(() => {
      this.setState(Object.assign({}, this.state, {author, name}));
    });
  }

  updateExcerpt(e) {
    this.setState(Object.assign({}, this.state, {excerpt: e.target.value}));
  }

  updateText(text) {
    this.setState(Object.assign({}, this.state, {text}));
  }

  handleSave() {
    const {draft, token} = this.props;
    const {title, excerpt, text} = this.state;
    saveArticle(token, draft.articleId, title, text, excerpt).then(({data}) => {
      if (data.err) {
        this.setState(Object.assign({}, this.state, {message: JSON.stringify(data.err)}));
      } else {
        this.setState(Object.assign({}, this.state, {text}));
      }
    });
  }

  handlePreview() {
    if (this.state.preview) {
      this.setState(Object.assign({}, this.state, {preview: false}));
      return;
    }
    const {draft, token} = this.props;
    const {title, excerpt, text} = this.state;
    saveArticle(token, draft.articleId, title, text, excerpt).then(({data}) => {
      if (data.err) {
        this.setState(Object.assign({}, this.state, {message: JSON.stringify(data.err)}));
      } else {
        this.setState(Object.assign({}, this.state, {
          preview: true,
          text
        }));
      }
    });
  }

  handlePublish() {
    if (this.state.excerpt.length < 5) {
      this.setState(Object.assign({}, this.state, {message: 'An excerpt is required to publish!'}));
      return;
    }
    const {draft, token} = this.props;
    const {title, excerpt, text} = this.state;
    saveArticle(token, draft.articleId, title, text, excerpt).then(({data}) => {
      if (data.err) {
        this.setState(Object.assign({}, this.state, {message: JSON.stringify(data.err)}));
      } else {
        publishArticle(token, draft.articleId).then(({data}) => {
          if (data.err) {
            this.setState(Object.assign({}, this.state, {message: JSON.stringify(data.err)}));
          } else {
            browserHistory.push('/');
          }
        });
      }
    });
  }

  handleCoverPhoto(image) {
    const {draft, token} = this.props;
    setCoverPhoto(token, draft.articleId, image).then(({data}) => {
      if (data.err) {
        this.setState(Object.assign({}, this.state, {message: JSON.stringify(data.err)}));
      } else {
        this.setState(Object.assign({}, this.state, {image}));
      }
    });
  }

  handleRetractArticle() {
    const {draft, token} = this.props;
    retractArticle(token, draft.articleId).then(({data}) => {
      if (data.err) {
        this.setState(Object.assign({}, this.state, {message: JSON.stringify(data.err)}));
      } else {
        browserHistory.push('/console');
      }
    });
  }

  handleExit() {
    browserHistory.push('/console');
  }

  onDropImage(files) {
    const {draft, token} = this.props;
    const file = files[0];
    updatePhoto(token, draft.articleId, file).then(({data}) => {
      if (data.err) {
        this.setState(Object.assign({}, this.state, {message: JSON.stringify(data.err)}));
      } else {
        location.reload();
      }
    });
  }

  onDropPodcast(files) {
    const {draft, token} = this.props;
    const file = files[0];
    this.setState(Object.assign({}, this.state, {message: "Please wait for the upload to complete...."}));
    const uploadProgress = (event) => {
      const percentage = Math.floor(event.loaded / event.total * 100);
      this.setState(Object.assign({}, this.state, {uploadProgress: percentage}));
    };
    updatePodcast(token, draft.articleId, file, uploadProgress).then(({data}) => {
      if (data.err) {
        this.setState(Object.assign({}, this.state, {message: JSON.stringify(data.err)}));
      } else {
        this.setState(Object.assign({}, this.state, {message: "Upload complete!"}));
        setTimeout(() => {
          location.reload();
        }, 2000);
      }
    });
  }

  render() {
    const {draft, token, authors} = this.props;
    const article = this.state;
    const cleanTitle = article.title.replace(/(<([^>]+)>)/ig, "");
    const author = token ? jwt_decode(token) : undefined;
    return (
      <div className="draft">
        <Helmet title={cleanTitle}/>
        <h3>Draft</h3>
        <button onClick={this.handleSave}>Save</button>
        <button
          onClick={this.handlePreview}>{this.state.preview ? "Edit" : "Preview" }</button>
        {author.can_publish ?
          <button onClick={this.handlePublish}>Publish</button> : null}
        {author.can_publish ?
          <button onClick={this.handleRetractArticle}>Retract</button> : null}
        <button onClick={this.handleExit}>Exit</button>
        {!this.state.preview ?
          <div>
            <div style={{width: "50%", float: "right"}}>
              {this.state.type === "podcast" ?
                <div>
                  <h4>Podcast</h4>
                  {this.state.podcast ?
                    <div>
                      Copy and paste this text into the article where the audio player should appear:
                      <input type="text" defaultValue={`<div id='player' data-podcast='${this.state.podcast}'></div>`} readOnly="true"/>
                      <AudioPlayer url={this.state.podcast}/>
                    </div>
                    : null}
                  <Dropzone onDrop={this.onDropPodcast}>
                    <div>Drop or click to upload a new podcast (.mp3)</div>
                  </Dropzone>
                  <progress value={this.state.uploadProgress} max="100"/>
                </div> : null}
              <h4>Images</h4>
              <Dropzone onDrop={this.onDropImage}>
                <div>Drop or click to upload a new photo (.png or .jpg)</div>
              </Dropzone>
              {draft.imgList.map((img) => {
                const markdown = `![](${img.url})`;
                return <div style={{width: "300px"}} key={img.url}>
                  <img src={img.url}/>
                  <input type="text" defaultValue={markdown} readOnly="true"/>
                  {img.url === this.state.image ? <p>Cover photo</p> :
                    <button onClick={this.handleCoverPhoto.bind(null, img.url)}>
                      Make article's cover photo</button>
                  }
                </div>
              })}
            </div>
            <div style={{width: "50%"}}>
              <div id="message">{this.state.message}</div>
              <input type="text"
                     id="title"
                     onChange={this.updateTitle}
                     placeholder="Article Title" value={this.state.title}/>
              <div>
                Author:
                <Select
                  noResultsText="No results found!"
                  clearable={false}
                  value={this.state.author}
                  onChange={this.updateAuthor}
                  options={authors}/>
              </div>
              <div>
                Type:
                <Select
                  noResultsText="No results found!"
                  clearable={false}
                  value={this.state.type}
                  onChange={this.updateType}
                  options={types}/>
              </div>
              <div>Excerpt:
                <textarea rows="3" cols="60"
                             type="text"
                             id="excerpt"
                             onChange={this.updateExcerpt}
                             placeholder="Excerpt" value={this.state.excerpt}/>
              </div>
              <div>
                <SimpleMDE
                  onChange={this.updateText}
                  value={this.state.text}
                  options={{
                    spellChecker: false
                  }}
                />
              </div>
            </div>
          </div> : <ArticleView article={article}/>}
      </div>
    )
  }
}
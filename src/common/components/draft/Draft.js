import React from "react"
import {asyncConnect} from "redux-connect"
import {
  getDraft,
  changeArticleAuthor,
  saveArticle,
  publishArticle,
  setCoverPhoto,
  retractArticle,
  updatePhoto
} from "../../api/article"
import Helmet from "react-helmet"
import ArticleView from "../ArticleView"
import browserHistory from "react-router/lib/browserHistory"
import Dropzone from "react-dropzone"
import jwt_decode from "jwt-decode"
import Select from "react-select"
import {allAuthors} from "../../api/index"
import SimpleMDE from "react-simplemde-editor"

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
    this.updateAuthor = this.updateAuthor.bind(this);
    this.updateExcerpt = this.updateExcerpt.bind(this);
    this.updateText = this.updateText.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.handlePublish = this.handlePublish.bind(this);
    this.handleCoverPhoto = this.handleCoverPhoto.bind(this);
    this.handleRetractArticle = this.handleRetractArticle.bind(this);
    this.handleExit = this.handleExit.bind(this);
    this.onDrop = this.onDrop.bind(this);
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
      preview: false,
      message: ''
    };
  }

  updateTitle(e) {
    this.setState(Object.assign({}, this.state, {title: e.target.value}));
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

  onDrop(files) {
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
              <h4>Images</h4>
              <Dropzone onDrop={this.onDrop}>
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
              <div id="message">{this.state.message}</div>
              <div><textarea rows="10" cols="20"
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
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
} from "../api/article"
import Helmet from "react-helmet"
import ArticleView from "./ArticleView"
import browserHistory from "react-router/lib/browserHistory"
import Dropzone from "react-dropzone"

let editor;

@asyncConnect([{
    key: 'draft',
    promise: ({store: {getState}, params}) => getDraft(getState().token, params.id)
  }],
  state => ({token: state.token})
)
export default class Draft extends React.Component {
  constructor(props) {
    super(props);
    this.updateTitle = this.updateTitle.bind(this);
    this.updateAuthor = this.updateAuthor.bind(this);
    this.updateExcerpt = this.updateExcerpt.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.loadLibraries = this.loadLibraries.bind(this);
    this.handlePublish = this.handlePublish.bind(this);
    this.handleCoverPhoto = this.handleCoverPhoto.bind(this);
    this.handleRetractArticle = this.handleRetractArticle.bind(this);
    this.onDrop = this.onDrop.bind(this);
    const {draft} = this.props;
    this.state = {
      title: draft.title,
      excerpt: draft.excerpt,
      author: draft.author,
      text: draft.text,
      image: draft.image,
      name: draft.name,
      pubDate: draft.date,
      articleId: draft.articleId,
      preview: false
    };
  }

  loadLibraries() {
    const search = $('#authorSearch');
    search.select2({
      width: '100%',
      placeholder: 'Choose author',
      escapeMarkup: (m) => m,
      ajax: {
        cache: true,
        delay: 250,
        type: 'GET',
        url: '/api/search/authors',
        processResults: (data) => ({
          results: $.map(data, (obj) => {
            return {id: obj.username, text: obj.name};
          })
        })
      }
    });
    const {params, token} = this.props;
    search.on('select2:select', function (e) {
      const author = e.target.value;
      const name = search.select2('data')[0].text;
      changeArticleAuthor(token, params.id, author).then(() => {
        this.setState(Object.assign({}, this.state, {author, name}));
      });
    }.bind(this));
    editor = new SimpleMDE({
      element: document.getElementById("textInput"),
      spellChecker: false
    });
  }

  componentDidMount() {
    this.loadLibraries();
  }

  componentDidUpdate() {
    this.loadLibraries();
  }

  updateTitle(e) {
    this.setState(Object.assign({}, this.state, {title: e.target.value}));
  }

  updateAuthor(e) {
    this.setState(Object.assign({}, this.state, {author: e.target.value}));
  }

  updateExcerpt(e) {
    this.setState(Object.assign({}, this.state, {excerpt: e.target.value}));
  }

  handleSave() {
    const {draft, token} = this.props;
    const {title, excerpt} = this.state;
    saveArticle(token, draft.articleId, title, editor.value(), excerpt).then(() => {
      this.setState(Object.assign({}, this.state, {text: editor.value()}));
    });
  }

  handlePreview() {
    if (this.state.preview) {
      this.setState(Object.assign({}, this.state, {preview: false}));
      return;
    }
    const {draft, token} = this.props;
    const {title, text, excerpt} = this.state;
    saveArticle(token, draft.articleId, title, editor.value(), excerpt).then(() => {
      this.setState(Object.assign({}, this.state, {
        preview: true,
        text: editor.value()
      }));
    });
  }

  handlePublish() {
    const {draft, token} = this.props;
    publishArticle(token, draft.articleId).then(() => {
      browserHistory.push('/');
    });
  }

  handleCoverPhoto(image) {
    const {draft, token} = this.props;
    setCoverPhoto(token, draft.articleId, image).then(() => {
      this.setState(Object.assign({}, this.state, {image}));
    });
  }

  handleRetractArticle() {
    const {draft, token} = this.props;
    retractArticle(token, draft.articleId).then(() => {
      browserHistory.push('/console');
    });
  }

  onDrop(files) {
    const {draft, token} = this.props;
    const file = files[0];
    updatePhoto(token, draft.articleId, file).then(() => {
      location.reload();
    });
  }

  render() {
    const {draft} = this.props;
    const article = this.state;
    const cleanTitle = article.title.replace(/(<([^>]+)>)/ig, "");
    return (
      <div>
        <Helmet title={cleanTitle}/>
        <h3>Draft</h3>
        <button onClick={this.handleSave}>Save</button>
        <button
          onClick={this.handlePreview}>{this.state.preview ? "Edit" : "Preview" }</button>
        <button onClick={this.handlePublish}>Publish</button>
        <button onClick={this.handleRetractArticle}>Retract</button>
        <button>Exit</button>
        {!this.state.preview ?
          <div>
            <div style={{width: "50%", float: "right"}}>
              <h4>Images</h4>
              <Dropzone onDrop={this.onDrop}>
                <div>Drop or click to upload a new photo (.png or .jpg)</div>
              </Dropzone>
              {draft.imgList.map((img) => {
                return <div style={{width: "300px"}} key={img.url}>
                  <img src={img.url}/>
                  {img.url === this.state.image ? <p>Cover photo</p> :
                    <button onClick={this.handleCoverPhoto.bind(null, img.url)}>
                      Make article's cover photo</button>
                  }
                </div>
              })}
            </div>
            <div style={{width: "50%"}}>
              <input type="text"
                     onChange={this.updateTitle}
                     placeholder="Article Title" value={this.state.title}/>
              <div>
                <label htmlFor="authorSearch">Author</label>
                <select id="authorSearch">
                  <option onChange={this.updateAuthor}
                          value={this.state.author}>
                    {this.state.name}
                  </option>
                </select>
              </div>
              <div><textarea rows="10" cols="20"
                             type="text"
                             onChange={this.updateExcerpt}
                             placeholder="Excerpt" value={this.state.excerpt}/>
              </div>
              <div>
                <textarea rows="30" cols="50" placeholder="Article Text..."
                          id="textInput" defaultValue={this.state.text}/>
              </div>
            </div>
          </div> : <ArticleView article={article}/>}
      </div>
    )
  }
}
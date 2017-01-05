import React from "react"
import {asyncConnect} from "redux-connect"
import {getDraft, changeArticleAuthor, saveArticle} from "../api/article"
import Helmet from "react-helmet"
import ArticleContent from "./ArticleContent"

@asyncConnect([{
    key: 'draft',
    promise: ({store: {getState}, params}) => getDraft(getState().token, params.id)
  }],
  state => {
    return {token: state.token};
  })
export default class Draft extends React.Component {
  constructor(props) {
    super(props);
    this.updateTitle = this.updateTitle.bind(this);
    this.updateAuthor = this.updateAuthor.bind(this);
    this.updateExcerpt = this.updateExcerpt.bind(this);
    this.updateText = this.updateText.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.showSelect2 = this.showSelect2.bind(this);
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

  showSelect2() {
    const search = $('#authorSearch');
    search.select2({
      width: '100%',
      placeholder: 'Choose author',
      escapeMarkup: function (m) {
        return m;
      },
      ajax: {
        cache: true,
        delay: 250,
        type: 'GET',
        url: '/api/search/authors',
        processResults: function (data) {
          return {
            results: $.map(data, function (obj) {
              return {id: obj.username, text: obj.name};
            })
          };
        }
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
  }

  componentDidMount() {
    this.showSelect2();
  }

  componentDidUpdate() {
    this.showSelect2();
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

  updateText(e) {
    this.setState(Object.assign({}, this.state, {text: e.target.value}));
  }

  handleSave() {
    const {draft, token} = this.props;
    const {title, text, excerpt} = this.state;
    saveArticle(token, draft.articleId, title, text, excerpt).then(() => {
      this.setState(Object.assign({}, this.state));
    });
  }

  handlePreview() {
    if (this.state.preview) {
      this.setState(Object.assign({}, this.state, {preview: false}));
      return;
    }
    const {draft, token} = this.props;
    const {title, text, excerpt} = this.state;
    saveArticle(token, draft.articleId, title, text, excerpt).then(() => {
      this.setState(Object.assign({}, this.state, {
        preview: true
      }));
    });
  }

  render() {
    const {draft} = this.props;
    const article = this.state;
    return (
      <div>
        <Helmet title={draft.title}/>
        <h3>Draft</h3>
        <button onClick={this.handleSave}>Save</button>
        <button
          onClick={this.handlePreview}>{this.state.preview ? "Edit" : "Preview" }</button>
        {!this.state.preview ?
          <div>
            <input type="text"
                   onChange={this.updateTitle}
                   placeholder="Article Title" value={this.state.title}/>
            <div>
              <label htmlFor="authorSearch">Author</label>
              <select id="authorSearch">
                <option onChange={this.updateAuthor} value={this.state.author}>
                  {this.state.name}
                </option>
              </select>
            </div>
            <textarea rows="10" cols="20"
                      type="text"
                      onChange={this.updateAuthor}
                      placeholder="Excerpt" value={this.state.excerpt}/>
            <textarea rows="30" cols="50" placeholder="Article Text..."
                      onChange={this.updateText}
                      id="textInput" value={this.state.text}/>
          </div> : <ArticleContent article={article}/>}
      </div>
    )
  }
}
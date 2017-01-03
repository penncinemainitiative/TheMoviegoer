import React from "react"
import {asyncConnect} from "redux-connect"
import {getDraft, changeArticleAuthor} from "../api/article"
import Helmet from "react-helmet"
import jwt_decode from "jwt-decode"

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
    const {draft} = this.props;
    this.state = {
      title: draft.title,
      excerpt: draft.excerpt,
      author: draft.author,
      text: draft.text
    };
  }

  componentDidMount() {
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
      changeArticleAuthor(token, params.id, e.target.value);
    });
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

  render() {
    const {draft, token} = this.props;
    const author = jwt_decode(token);
    const title = {__html: draft.title};
    return (
      <div>
        <Helmet title={draft.title}/>
        <h3>Draft</h3>
        <h4 dangerouslySetInnerHTML={title}></h4>
        <input type="text" id="titleInput"
               label="Title (use HTML tags like <i></i> or <b></b> for style)"
               onChange={this.updateTitle}
               placeholder="Article Title" value={this.state.title}/>
        <div>
          <label htmlFor="authorSearch">Author</label>
          <select id="authorSearch">
            <option onChange={this.updateAuthor} value={this.state.author}>
              {this.state.author}
            </option>
          </select>
        </div>
        <input type="text" id="excerptInput"
               label="Excerpt"
               onChange={this.updateAuthor}
               placeholder="Excerpt" value={this.state.excerpt}/>
        <input type="textarea" placeholder="Article Text..."
               label="Text (use Markdown for style)"
               onChange={this.updateText}
               id="textInput" value={this.state.text}/>
      </div>
    )
  }
}
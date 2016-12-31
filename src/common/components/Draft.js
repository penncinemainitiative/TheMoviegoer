import React from "react"
import {asyncConnect} from "redux-connect"
import {connect} from "react-redux"
import {getDraft} from "../api/article"
import Helmet from "react-helmet"
import jwt_decode from "jwt-decode"

@asyncConnect([{
  key: 'draft',
  promise: ({store, params, helpers}) => getDraft(store, params.id)
}])
@connect(state => {
  return {user: state.authToken};
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
    const {draft, user} = this.props;
    const author = jwt_decode(user);
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
          <label htmlFor="authorInput">Author</label>
          <select id="authorInput" className="form-control">
            <option
              onChange={this.updateAuthor}
              value={this.state.author}>{this.state.author}</option>
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
import React from "react"
import {asyncConnect} from "redux-connect"
import {getAllUnpublishedArticles} from "../../api/console"
import {getMyUnpublishedArticles, getWriterByName} from "../../api/author"
import {newArticle, deleteArticle, changeArticleEditor} from "../../api/article"
import Helmet from "react-helmet"
import jwt_decode from "jwt-decode"
import Link from "react-router/lib/Link"
import browserHistory from "react-router/lib/browserHistory"
import cookie from "react-cookie"
import {logout} from "../../actions/auth"
import WriterEditor from "./WriterEditor"
import {allAuthors} from "../../api/index"
import Select from "react-select"

@asyncConnect([],
  state => ({token: state.token})
)
class ArticleList extends React.Component {
  constructor(props) {
    super(props);
    this.handleDeleteArticle = this.handleDeleteArticle.bind(this);
    this.updateEditor = this.updateEditor.bind(this);
  }

  updateEditor(id, clicked) {
    const {token} = this.props;
    const editor = clicked.value;
    console.log(editor);
    changeArticleEditor(token, id, editor).then(() => {
      this.props.dispatch(getAllUnpublishedArticles());
      this.props.dispatch(getMyUnpublishedArticles());
    })
  }

  handleDeleteArticle(id) {
    const {token} = this.props;
    deleteArticle(token, id).then(() => {
      this.props.dispatch(getAllUnpublishedArticles());
      this.props.dispatch(getMyUnpublishedArticles());
    });
  }

  render() {
    const {articles, username, authors} = this.props;
    return (
      <table>
        <thead>
        <tr>
          <th>Title</th>
          <th>Last updated</th>
          <th>Author</th>
          <th>Editor</th>
          <th>Delete</th>
        </tr>
        </thead>
        <tbody>
        {articles.map(function (article) {
          const title = {__html: article.title};
          const draftUrl = `/draft/${article.articleId}`;
          return <tr key={article.articleId}>
            <td><Link to={draftUrl}>
              <span dangerouslySetInnerHTML={title}/>
            </Link></td>
            <td>{article.updateDate}</td>
            <td>{article.name}</td>
            <td style={{width: "300px"}}>
              <Select
                menuContainerStyle={{zIndex: 500}}
                clearable={false}
                noResultsText="No results found!"
                value={article.assignedEditor}
                onChange={this.updateEditor.bind(null, article.articleId)}
                options={authors}/>
            </td>
            <td><button onClick={this.handleDeleteArticle.bind(null, article.articleId)}>
              Delete</button></td>
          </tr>;
        }.bind(this))}
        </tbody>
      </table>
    );
  }
}

@asyncConnect([{
    promise: ({store: {dispatch}}) => dispatch(getAllUnpublishedArticles())
  }, {
    promise: ({store: {dispatch}}) => dispatch(getMyUnpublishedArticles())
  }, {
    key: 'writer',
    promise: ({store: {getState}}) => getWriterByName(jwt_decode(getState().token).name)
  }, {
    key: 'authors',
    promise: () => allAuthors()
  }],
  state => ({
    token: state.token,
    allUnpublished: state.console.allUnpublishedArticles,
    myUnpublished: state.console.myUnpublishedArticles
  })
)
export default class Console extends React.Component {
  constructor(props) {
    super(props);
    this.handleNewArticle = this.handleNewArticle.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      err: ''
    };
  }

  handleNewArticle() {
    const {token} = this.props;
    newArticle(token).then(({data}) => {
      if (data.err) {
        this.setState(Object.assign({}, this.state, {err: JSON.stringify(data.err)}));
      } else {
        browserHistory.push(`/draft/${data.articleId}`);
      }
    }).catch((err) => {
      this.setState(Object.assign({}, this.state, {err: JSON.stringify(data.err)}));
    });
  }

  logout() {
    cookie.remove('token', {path: '/'});
    this.props.dispatch(logout());
    browserHistory.push('/login');
  }

  render() {
    const {allUnpublished, myUnpublished, token, writer, authors} = this.props;
    const author = token ? jwt_decode(token) : undefined;
    return (
      <div className="console">
        <Helmet title="Console"/>
        {author ?
          <div>
            <div className="profile">
              {this.state.err ? <div>Error: {this.state.err}</div> : null}
              <h4>Welcome, {author.name}!</h4>
              <Link id="profileLink" to={writer.url}><h5>My profile</h5></Link>
              <WriterEditor writer={writer} token={token}/>
              <button onClick={this.handleNewArticle}>New article</button>
              <button onClick={this.logout}>Logout</button>
            </div>
            <div className="my-articles">
              <h5>My unpublished articles</h5>
              <ArticleList articles={myUnpublished} authors={authors}
                           username={author.username}/>
            </div>
            {author.can_assign_editor ?
              <div className="all-articles">
                <h5>All unpublished articles</h5>
                <ArticleList articles={allUnpublished}
                             authors={authors}
                             username={author.username}/>
              </div> : null}
          </div> : null}
      </div>
    )
  }
}
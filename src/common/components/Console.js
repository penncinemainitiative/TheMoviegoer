import React from "react"
import {asyncConnect} from "redux-connect"
import {getAllUnpublishedArticles} from "../api/console"
import {getMyUnpublishedArticles} from "../api/author"
import {newArticle, deleteArticle} from "../api/article"
import Helmet from "react-helmet"
import jwt_decode from "jwt-decode"
import Link from "react-router/lib/Link"
import browserHistory from "react-router/lib/browserHistory"

@asyncConnect([],
  state => ({token: state.token})
)
class ArticleList extends React.Component {
  constructor(props) {
    super(props);
    this.handleDeleteArticle = this.handleDeleteArticle.bind(this);
  }

  handleDeleteArticle(id) {
    const {token} = this.props;
    deleteArticle(token, id).then(() => {
      this.props.dispatch(getAllUnpublishedArticles());
      this.props.dispatch(getMyUnpublishedArticles());
    });
  }

  render() {
    const {articles, username} = this.props;
    return (
      <table>
        <thead>
        <tr>
          <th>Title</th>
          <th>Last updated</th>
          <th>Author</th>
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
            <td>{username === article.author ?
              <button
                onClick={this.handleDeleteArticle.bind(null, article.articleId)}>
                Delete</button> : null}</td>
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
  }

  handleNewArticle() {
    const {token} = this.props;
    newArticle(token).then(({data}) => {
      browserHistory.push(`/draft/${data.articleId}`);
    });
  }

  render() {
    const {allUnpublished, myUnpublished, token} = this.props;
    const author = jwt_decode(token);
    return (
      <div>
        <Helmet title="Console"/>
        <h4>Welcome, {author.name}!</h4>
        <button onClick={this.handleNewArticle}>New article</button>
        <h5>My unpublished articles</h5>
        <ArticleList articles={myUnpublished} username={author.username}/>
        <h5>All unpublished articles</h5>
        <ArticleList articles={allUnpublished} username={author.username}/>
      </div>
    )
  }
}
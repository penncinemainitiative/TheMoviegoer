import React from "react"
import {asyncConnect} from "redux-connect"
import {getAllUnpublishedArticles} from "../api/console"
import {getMyUnpublishedArticles} from "../api/author"
import Helmet from "react-helmet"
import jwt_decode from "jwt-decode"
import Link from "react-router/lib/Link"

@asyncConnect([{
    key: 'allUnpublished',
    promise: ({store: {getState}}) => getAllUnpublishedArticles(getState().token)
  }, {
    key: 'myUnpublished',
    promise: ({store: {getState}}) => getMyUnpublishedArticles(getState().token)
  }],
  state => {
    return {token: state.token};
  })
export default class Console extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {allUnpublished, myUnpublished, token} = this.props;
    const author = jwt_decode(token);
    return (
      <div>
        <Helmet title="Console"/>
        <h4>Welcome, {author.name}!</h4>
        <h5>Your unpublished articles</h5>
        <ul>
          {myUnpublished.map((article) => {
            const innerHTML = {__html: article.title};
            const draftUrl = '/draft/' + article.articleId;
            return <li key={article.articleId}>
              <Link to={draftUrl}><span
                dangerouslySetInnerHTML={innerHTML}/></Link>
              by {article.name}, last updated {article.updateDate}
            </li>
          })}
        </ul>
        <h5>All unpublished articles</h5>
        <ul>
          {allUnpublished.map((article) => {
            const innerHTML = {__html: article.title};
            const draftUrl = '/draft/' + article.articleId;
            return <li key={article.articleId}>
              <Link to={draftUrl}><span
                dangerouslySetInnerHTML={innerHTML}/></Link>
              by {article.name}, last updated {article.updateDate}
            </li>
          })}
        </ul>
      </div>
    )
  }
}
import React from "react"
import {asyncConnect} from "redux-connect"
import {connect} from "react-redux"
import {getArticle} from "../api/article"
import Helmet from "react-helmet"
import marked from "marked"
import Link from "react-router/lib/Link"
import jwt_decode from "jwt-decode"

@asyncConnect([{
  key: 'article',
  promise: ({params, helpers}) =>
    getArticle(params.year, params.month, params.day, params.slug)
}])
@connect(state => {
  return {user: state.authToken};
})
export default class Article extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {article, user} = this.props;
    const title = {__html: article.title};
    const text = {__html: marked(article.text.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"))};
    const draftUrl = '/draft/' + article.articleId;
    const author = user ? jwt_decode(user) : false;
    return (
      <div>
        <Helmet title={article.title}/>
        <h4 dangerouslySetInnerHTML={title}></h4>
        <h5>{article.name} - {article.pubDate}</h5>
        {author ? <Link to={draftUrl}>Edit</Link> : null}
        <div dangerouslySetInnerHTML={text}></div>
      </div>
    )
  }
}
import React from "react"
import {asyncConnect} from "redux-connect"
import {getArticle} from "../api/article"
import {getArchiveArticle} from "../api/index"
import Helmet from "react-helmet"
import marked from "marked"
import Link from "react-router/lib/Link"
import jwt_decode from "jwt-decode"

@asyncConnect([{
    key: 'article',
    promise: ({params}) =>
      getArticle(params.year, params.month, params.day, params.slug)
  }, {
    key: 'archive',
    promise: () => getArchiveArticle()
  }],
  state => {
    return {token: state.token};
  })
export default class Article extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {article, token, archive} = this.props;
    const title = {__html: article.title};
    const text = {__html: marked(article.text.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"))};
    const draftUrl = '/draft/' + article.articleId;
    const author = token ? jwt_decode(token) : false;
    return (
      <div className="articlePage">
        <Helmet title={article.title}/>
        <div className="article_content">
          <img src={article.image}/>
          <h4 dangerouslySetInnerHTML={title}></h4>
          <h5>{article.name} - {article.pubDate}</h5>
          {author ? <Link to={draftUrl}>Edit</Link> : null}
          <div dangerouslySetInnerHTML={text}></div>
        </div>
        <div className="author_card"></div>
        <div className="archive">
          {archive.map((article) => {
            const innerHTML = {__html: article.title};
            return <h4 key={article.title}>
              <Link to={article.url} dangerouslySetInnerHTML={innerHTML}></Link>
            </h4>
          })}
        </div>
        <div className="comments"></div>
      </div>
    )
  }
}
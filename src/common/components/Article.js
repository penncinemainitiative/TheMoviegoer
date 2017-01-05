import React from "react"
import {asyncConnect} from "redux-connect"
import {getArticle} from "../api/article"
import {getArchiveArticle} from "../api/index"
import Helmet from "react-helmet"
import Link from "react-router/lib/Link"
import jwt_decode from "jwt-decode"
import ArticleContent from "../components/ArticleContent"

const defaultDescription = "The Moviegoer is a student-run blog dedicated to film appreciation - " +
  "posting film analyses, reviews, previews, and all things related. " +
  "It is run by the Penn Cinema Initiative.";

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
  render() {
    const {article, token, archive} = this.props;
    const author = token ? jwt_decode(token) : false;
    const description = article.excerpt ? article.excerpt : defaultDescription;
    const cleanTitle = article.title.replace(/(<([^>]+)>)/ig, "");
    return (
      <div className="articlePage">
        <Helmet title={cleanTitle}
                meta={[
                  {property: "description", content: description},
                  {property: "og:description", content: description},
                  {property: "og:title", content: cleanTitle},
                  {property: "og:url", content: article.url},
                  {property: "og:image", content: article.image}
                ]}/>
        <ArticleContent article={article} showEdit={author}/>
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
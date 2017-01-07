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
  state => ({token: state.token})
)
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
        <div className="author_card">
          <div className="text-container">
            <h3>Writer Name</h3>
            <p>Bio</p>
          </div>
        </div>
        <div className="archive">
          <div className="title-wrapper"><h3>Archive</h3></div>
              {archive.map((article) => {
                const innerHTML = {__html: article.title};
                return <div key={article.title} className="content-wrapper">
                  <Link to={article.url}>
                    <div className="image-wrapper">
                      <img src={article.image}/>
                    </div>
                    <div className="text-wrapper">
                      <h3 dangerouslySetInnerHTML={innerHTML}></h3>
                      <h5><span>{article.pubDate}</span>  - {article.name}</h5>
                    </div>
                  </Link>
                </div>
              })}
        </div>
        <div className="comments"></div>
      </div>
    )
  }
}
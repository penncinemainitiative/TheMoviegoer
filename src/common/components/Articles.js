import React from "react"
import {asyncConnect} from "redux-connect"
import Helmet from "react-helmet"
import {getRecentArticles} from "../api/index"
import Link from "react-router/lib/Link"

@asyncConnect([{
  key: 'articles',
  promise: () => getRecentArticles()
}])
export default class Articles extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {articles} = this.props;
    return (
      <div>
        <Helmet title="Articles"/>
        {articles.map((article) => {
          const innerHTML = {__html: article.title};
          return <div key={article.articleId} className="list-article">
            <Link to={article.url}>
              <div className="image"><img src={article.image}/></div></Link>
            <div className="text-container">
              <Link to={article.url} dangerouslySetInnerHTML={innerHTML}></Link>
              <h5>{article.name} - {article.pubDate}</h5>
              <p>{article.excerpt}</p>
            </div>
          </div>
        })}
      </div>
    )
  }
}

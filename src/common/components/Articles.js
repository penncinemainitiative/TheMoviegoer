import React from "react"
import {asyncConnect} from "redux-connect"
import Helmet from "react-helmet"
import {getRecentArticles} from "../api/index"
import Link from "react-router/lib/Link"
import {getResizedImage} from "./utils"

@asyncConnect([{
  promise: ({store: {getState, dispatch}}) => {
    if (getState().recentArticles.articles.length === 0) {
      return dispatch(getRecentArticles());
    } else {
      return Promise.resolve();
    }
  }
}], (state) => ({
  articles: state.recentArticles.articles
}))
export default class Articles extends React.Component {
  constructor(props) {
    super(props);
    this.requestMoreArticles = this.requestMoreArticles.bind(this);
  }

  requestMoreArticles() {
    this.props.dispatch(getRecentArticles());
  }

  render() {
    return (
      <div className="articlesPage">
        <Helmet title="Articles"
                meta={[
                  {
                    property: "description",
                    content: "Browse all The Moviegoer's articles, from contemporary cinema to classic films."
                  },
                ]}/>
        <div className="articles">
          {this.props.articles.map((article) => {
            const innerHTML = {__html: article.title};
            return <div key={article.articleId} className="list-article">
              <Link to={article.url}>
                <div className="image-wrapper">
                  <div className="inner-wrapper">
                    {getResizedImage(article.image, 600, 600)}
                  </div>
                </div>
              </Link>
              <div className="text-container">
                <h3><Link to={article.url}
                          dangerouslySetInnerHTML={innerHTML}></Link></h3>
                <h5><span>{article.pubDate}</span> - {article.name}</h5>
                <p>{article.excerpt}</p>
              </div>
            </div>
          })}
          <div className="more-button" onClick={this.requestMoreArticles}>
            <p>More?</p>
          </div>
        </div>
      </div>
    )
  }
}

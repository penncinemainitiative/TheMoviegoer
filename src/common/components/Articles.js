import React from "react"
import {asyncConnect} from "redux-connect"
import Helmet from "react-helmet"
import {getRecentArticles} from "../api/index"
import Link from "react-router/lib/Link"
import {getResizedImage} from "./utils"

@asyncConnect([{
  key: 'articles',
  promise: () => getRecentArticles(0)
}])
export default class Articles extends React.Component {
  constructor(props) {
    super(props);
    this.requestMoreArticles = this.requestMoreArticles.bind(this);
    this.state = {
      articles: this.props.articles,
      offset: 10
    }
  }

  requestMoreArticles() {
    const articles = this.state.articles;
    getRecentArticles(this.state.offset).then((data) => {
      this.setState(Object.assign({}, this.state, {
        articles: articles.concat(data),
        offset: this.state.offset + 10
      }))
    })
  }

  render() {
    return (
      <div className="articlesPage">
        <Helmet title="Articles"/>
        <div className="articles">
          {this.state.articles.map((article) => {
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
          <button onClick={this.requestMoreArticles}>More</button>
        </div>
      </div>
    )
  }
}

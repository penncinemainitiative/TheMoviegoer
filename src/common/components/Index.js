import React from "react"
import {asyncConnect} from "redux-connect"
import Helmet from "react-helmet"
import {getRecentArticles, getArchiveFront} from "../api/index"
import Link from "react-router/lib/Link"

@asyncConnect([{
  key: 'articles',
  promise: () => getRecentArticles()
}, {
  key: 'archive',
  promise: () => getArchiveFront()
}])
export default class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {articles, archive} = this.props;
    return (
      <div className="homePage">
        <Helmet title="The Moviegoer"/>
        <div className="feature-content">
          <div className="test1"></div>
          <div className="test2"></div>
          <div className="test2"></div>
        </div>
        <div className="lower-content">
          <div className="recent"></div>
          <div className="archive">
            {archive.map((article) => {
              const innerHTML = {__html: article.title};
              return <h4 key={article.title}>
                <Link to={article.url} dangerouslySetInnerHTML={innerHTML}></Link>
              </h4>
            })}
          </div>
        </div>
        <div className="debug">
          {articles.map((article) => {
            const innerHTML = {__html: article.title};
            return <h4 key={article.title}>
              <Link to={article.url} dangerouslySetInnerHTML={innerHTML}></Link>
            </h4>
          })}
        </div>
      </div>
    )
  }
}

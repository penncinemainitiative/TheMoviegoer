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
  render() {
    const {articles, archive} = this.props;
    const big_feature = articles[0];
    const small_features = articles.slice(1, 3);
    const recent = articles.slice(3, 8);
    return (
      <div className="homePage">
        <Helmet title="The Moviegoer"/>
        <div className="content">
          <div className="top-wrapper">
            <div className="image-wrapper1"><Link to={big_feature.url}>
              <img src={big_feature.image}/>
            </Link></div>
            {small_features.map((article) => {
              return <div key={article.title} className="image-wrapper2">
                <Link to={article.url}><img src={article.image}/></Link></div>
            })}
          </div>
          <div className="bot-wrapper">
            <div className="recent">
              <h3>Recent</h3>
              <ul>
                {recent.map((article) => {
                  const innerHTML = {__html: article.title};
                  return <li key={article.title}>
                    <Link to={article.url}
                          dangerouslySetInnerHTML={innerHTML}></Link>
                  </li>
                })}
              </ul>
            </div>
            <div className="archive">
              <h3>Archive</h3>
              {archive.map((article) => {
                const innerHTML = {__html: article.title};
                return <div key={article.title} className="image-wrapper3">
                  <Link to={article.url}><img src={article.image}/></Link>
                </div>
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

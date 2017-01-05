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

            <div className="big_feature">
              <div className="text-wrapper">
                <h2>{big_feature.title}<span> - {big_feature.author}</span></h2>
              </div>
              <div className="image-wrapper">
                <img src={big_feature.image}/>
              </div>
            </div>

            {small_features.map((article) => {
              return <div key={article.title} className="small_feature">
                  <div className="text-wrapper">
                    <h2>{article.title}<span> - {article.author}</span></h2>
                  </div>
                  <div className="image-wrapper">
                    <img src={article.image}/>
                  </div>
                </div>
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
              <div className="title-wrapper"><h3>Archive</h3></div>
              {archive.map((article) => {
                const innerHTML = {__html: article.title};
                return <div key={article.title} className="content-wrapper">
                  <div className="image-wrapper"><img src={article.image}/></div>
                  <div className="text-wrapper">{article.title}</div>
                </div>
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

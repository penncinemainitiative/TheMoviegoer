import React from "react"
import {asyncConnect} from "redux-connect"
import Helmet from "react-helmet"
import {getFrontPageArticles, getArchiveFront} from "../api/index"
import Link from "react-router/lib/Link"
import {getResizedImage} from "./utils"

@asyncConnect([{
  key: 'articles',
  promise: () => getFrontPageArticles()
}, {
  key: 'archive',
  promise: () => getArchiveFront()
}])
export default class Index extends React.Component {
  render() {
    const {articles, archive} = this.props;
    const big_feature = articles[0];
    const BigInnerHTML = {__html: big_feature.title + '<span> - ' + big_feature.name + '</span>'};
    const small_features = articles.slice(1, 3);
    const recent = articles.slice(3, 10);
    return (
      <div className="homePage">
        <Helmet meta={[
          {
            property: "description", content: `The Moviegoer, a student-run blog dedicated to film appreciation -
                  posting film analyses, reviews, previews, and all things related.`
          },
        ]}/>
        <div className="content">
          <div className="top-wrapper">
            <div className="big_feature">
              <Link to={big_feature.url}>
                <div className="text-wrapper">
                  <h2 dangerouslySetInnerHTML={BigInnerHTML}></h2>
                </div>
                <div className="image-wrapper">
                  <div className="inner-wrapper">
                    {getResizedImage(big_feature.image, 800, 600)}
                  </div>
                </div>
              </Link>
            </div>
            {small_features.map((article) => {
              const innerHTML = {__html: article.title + '<span> - ' + article.name + '</span>'};
              return <div key={article.articleId} className="small_feature">
                <Link to={article.url}>
                  <div className="text-wrapper">
                    <h2 dangerouslySetInnerHTML={innerHTML}></h2>
                  </div>
                  <div className="image-wrapper">
                    <div className="inner-wrapper">
                      {getResizedImage(article.image, 600, 600)}
                    </div>
                  </div>
                </Link>
              </div>
            })}
          </div>
          <div className="bot-wrapper">
            <div className="recent">
              <div className="title-wrapper"><h3>Recent</h3></div>
              <div className="list">
                <ul>
                  {recent.map((article) => {
                    const innerHTML = {__html: article.title};
                    return <h4 key={article.articleId}>
                      <li><Link to={article.url}
                                dangerouslySetInnerHTML={innerHTML}></Link></li>
                    </h4>
                  })}
                </ul>
              </div>
            </div>
            <div className="archive">
              <div className="title-wrapper"><h3>Archive</h3></div>
              {archive.map((article) => {
                const innerHTML = {__html: article.title};
                return <div key={article.articleId} className="content-wrapper">
                  <Link to={article.url}>
                    <div className="image-wrapper">
                      <div className="inner-wrapper">
                        {getResizedImage(article.image, 400, 400)}
                      </div>
                    </div>
                    <div className="text-wrapper">
                      <h3 dangerouslySetInnerHTML={innerHTML}></h3>
                      <h5><span>{article.pubDate}</span> - {article.name}</h5>
                    </div>
                  </Link>
                </div>
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

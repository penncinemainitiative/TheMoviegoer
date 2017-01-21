import React from "react"
import {asyncConnect} from "redux-connect"
import {getWriter} from "../api/author"
import Link from "react-router/lib/Link"
import {getResizedImage} from "./utils"
import Helmet from "react-helmet"

@asyncConnect([{
  key: 'writer',
  promise: ({params}) => getWriter(params.writer)
}])
export default class Writer extends React.Component {
  render() {
    const {writer} = this.props;
    return (
      <div className="writerPage">
        <Helmet title={writer.name}/>
        <div className="writer-bio">
          <div className="image-wrapper">
            {getResizedImage(writer.image, 400, 400)}
          </div>
          <div className="text-wrapper">
            <div className="name-container">
              <h4>{writer.name}</h4>
              <div className="accent"></div>
              <h5><i>{writer.position ? writer.position : "Writer"}</i></h5>
            </div>
            <p>{writer.bio}</p>
          </div>
        </div>
        <div className="articles-container">
          {writer.articles.map((article) => {
            const innerHTML = {__html: article.title + '<span> - ' + article.pubDate + '</span>'};
            return <div key={article.articleId} className="article">
              <Link to={article.url}>
                <div className="image-wrapper">
                  {getResizedImage(article.image, 400, 600)}
                </div>
                <div className="text-wrapper">
                  <h4 dangerouslySetInnerHTML={innerHTML}></h4>
                </div>
              </Link>
            </div>
          })}
        </div>
      </div>
    )
  }
}
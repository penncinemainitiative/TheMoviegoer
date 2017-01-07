import React from "react"
import {asyncConnect} from "redux-connect"
import {getWriter} from "../api/author"
import Helmet from "react-helmet"
import Link from "react-router/lib/Link"

@asyncConnect([{
  key: 'writer',
  promise: ({params}) => getWriter(params.writer)
}])
export default class Writer extends React.Component {
  render() {
    const {writer} = this.props;
    return (
    <div className="writerPage">
      <div className="writer-bio">
        <div className="image-wrapper">
          <img src={writer.image}/>
        </div>
        <div className="text-wrapper">
          <div className="name-container">
            <h4>{writer.name}</h4>
            <div className="accent"></div>
            <h5><i>Some description</i></h5>
          </div>
          <p>{writer.bio}</p>
        </div>
      </div>
      <div className="articles-container">
          {writer.articles.map((article) => {
            const innerHTML = {__html: article.title + '<span> - ' + article.pubDate + '</span>'};
            return <div key={article.title} className="article">
              <Link to={article.url}>
                <div className="image-wrapper">
                  <img src={article.image}/>
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
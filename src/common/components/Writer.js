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
        <Helmet title={writer.name}/>
        <div className="bio-container">
          <div className="image-wrapper">
            <img src={writer.image}/>
          </div>
          <div className="text-wrapper">
            <h4>{writer.name}</h4>
            <p>{writer.bio}</p>
          </div>
        </div>
        <div className="articles-container">
          <ul>
            {writer.articles.map((article) => {
              const innerHTML = {__html: article.title};
              return <h4 key={article.title}>
                <li><Link to={article.url}
                          dangerouslySetInnerHTML={innerHTML}></Link></li>
              </h4>
            })}
          </ul>
        </div>
      </div>
    )
  }
}
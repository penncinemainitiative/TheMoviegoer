import React from "react"
import {asyncConnect} from "redux-connect"
import Helmet from "react-helmet"
import {getRecentArticles} from "../api/index"

@asyncConnect([{
  key: 'articles',
  promise: ({params, helpers}) => getRecentArticles()
}])
export default class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {articles} = this.props;
    return (
      <div>
        <Helmet title="The Moviegoer"/>
        {articles.map(function (article) {
          return <h4 key={article.title}>{article.title}</h4>
        })}
      </div>
    )
  }
}

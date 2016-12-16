import React from "react"
import {asyncConnect} from "redux-connect"
import {getArticle} from "../api/index"
import Helmet from "react-helmet"

@asyncConnect([{
  key: 'article',
  promise: ({params, helpers}) =>
    getArticle(params.year, params.month, params.day, params.slug)
}])
export default class Article extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {article} = this.props;
    return (
      <div>
        <Helmet title={article.title}/>
        Article {JSON.stringify(article)}
      </div>
    )
  }
}
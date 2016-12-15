import React from "react"
import {asyncConnect} from "redux-connect"
import {getArticle} from "../api/index"

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
    return (<div>Article {JSON.stringify(article)}</div>)
  }
}
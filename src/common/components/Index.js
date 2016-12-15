import React from "react"
import {asyncConnect} from "redux-connect"
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
    return (<div>Index: {JSON.stringify(articles)}</div>)
  }
}
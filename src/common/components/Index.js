import React from "react"
import {asyncConnect} from "redux-connect"
import {getRecentArticles} from "../api/index"
import Helmet from "react-helmet"

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
        Index: {JSON.stringify(articles)}
      </div>
    )
  }
}
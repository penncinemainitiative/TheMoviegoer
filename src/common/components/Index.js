import React from "react"
import {asyncConnect} from "redux-connect"
import Helmet from "react-helmet"
import {getRecentArticles} from "../api/index"
import Link from "react-router/lib/Link"

@asyncConnect([{
  key: 'articles',
  promise: () => getRecentArticles()
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
        {articles.map((article) => {
          const innerHTML = {__html: article.title};
          return <h4 key={article.title}>
            <Link to={article.url} dangerouslySetInnerHTML={innerHTML}></Link>
          </h4>
        })}
      </div>
    )
  }
}

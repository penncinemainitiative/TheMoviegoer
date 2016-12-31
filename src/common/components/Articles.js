import React from "react"
import {asyncConnect} from "redux-connect"
import Helmet from "react-helmet"
import {getRecentArticles} from "../api/index"

@asyncConnect([{
  key: 'articles',
  promise: ({params, helpers}) => getRecentArticles()
}])
export default class Articles extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {articles} = this.props;
    return (
      <div>
        <Helmet title="Articles"/>
        {articles.map((article) => {
          const innerHTML = {__html: article.title};
          return <div key={article.articleId}>
            <h4 dangerouslySetInnerHTML={innerHTML}></h4>
            <p>{article.excerpt}</p>
          </div>
        })}
      </div>
    )
  }
}

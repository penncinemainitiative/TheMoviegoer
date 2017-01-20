import React from "react"
import {asyncConnect} from "redux-connect"
import {getArticle} from "../api/article"
import {getArchiveArticle} from "../api/index"
import ArticleView from "../components/ArticleView"

@asyncConnect([{
    key: 'article',
    promise: ({params}) =>
      getArticle(params.year, params.month, params.day, params.slug)
  }, {
    key: 'archive',
    promise: () => getArchiveArticle()
  }],
  state => ({token: state.token})
)
export default class Article extends React.Component {
  componentDidMount() {
    if (typeof FB !== 'undefined' && FB !== null) {
      FB.XFBML.parse();
    }
  }

  componentDidUpdate() {
    if (typeof FB !== 'undefined' && FB !== null) {
      FB.XFBML.parse();
    }
  }

  render() {
    return <ArticleView {...this.props}/>
  }
}
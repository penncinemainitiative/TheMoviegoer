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
    //use jQuery for more granular styling of article body
    console.log('test');
    console.log($('p:has(img)'));
    $('p:has(img)').addClass('image-container');
  }

  render() {
    return <ArticleView {...this.props}/>
  }
}
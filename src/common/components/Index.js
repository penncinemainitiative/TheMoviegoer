import React from 'react'
import { resolve } from 'react-resolver'
import { getRecentArticles } from '../api/index'

@resolve('articles', function(props) {
  return getRecentArticles();
})
export default class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { articles } = this.props;
    return (<div>Index: {JSON.stringify(articles)}</div>)
  }
}
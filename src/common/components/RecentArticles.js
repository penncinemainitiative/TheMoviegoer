import React from 'react'

export default class RecentArticles extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!this.props.recentArticles) {

    }
  }
  render() {
    return (<div>Index</div>)
  }
}
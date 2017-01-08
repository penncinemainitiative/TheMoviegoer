import React from "react"
import Helmet from "react-helmet"

export default class PageNotFound extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Page Not Found"/>
        <h1>Not found</h1>
      </div>
    )
  }
}
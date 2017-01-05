import React from "react"
import Helmet from "react-helmet"

export default class PageNotFound extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Page Not Found"/>
        404
      </div>
    )
  }
}
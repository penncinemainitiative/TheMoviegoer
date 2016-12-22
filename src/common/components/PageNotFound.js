import React from "react"
import Helmet from "react-helmet"

export default class PageNotFound extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Helmet title="Page Not Found"/>
        404
      </div>
    )
  }
}
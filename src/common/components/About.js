import React from "react"
import Helmet from "react-helmet"

export default class About extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Helmet title="About"/>
        About
      </div>
    )
  }
}
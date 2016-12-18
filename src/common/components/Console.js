import React from "react"
import Helmet from "react-helmet"

export default class Console extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Helmet title="Console"/>
        Console
      </div>
    )
  }
}
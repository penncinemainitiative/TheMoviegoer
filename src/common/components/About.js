import React from "react"
import Helmet from "react-helmet"

export default class About extends React.Component {
  render() {
    return (
      <div className="aboutPage">
        <Helmet title="About"/>
        <div className="content-left">
          <div className="letter">
            <h3>Letter from the Editor</h3>
          </div>
          <div className="contact">
            <h3>Contact Us</h3>
          </div>
        </div>
        <div className="staff">
          <h3>Staff</h3>
        </div>
      </div>
    )
  }
}
import React from "react"
import Helmet from "react-helmet"
import {asyncConnect} from "redux-connect"

@asyncConnect([])
export default class Signup extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Signup"/>
      </div>
    );
  }
}
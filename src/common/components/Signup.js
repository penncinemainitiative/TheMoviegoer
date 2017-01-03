import React from "react"
import Helmet from "react-helmet"
import {asyncConnect} from "redux-connect"

@asyncConnect([])
export default class Signup extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Helmet title="Signup"/>
      </div>
    );
  }
}
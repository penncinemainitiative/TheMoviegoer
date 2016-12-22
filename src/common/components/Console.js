import React from "react"
import {asyncConnect} from "redux-connect"
import {protectedContent} from "../api/index"
import Helmet from "react-helmet"

@asyncConnect([{
  key: 'welcome',
  promise: ({store, params, helpers}) => protectedContent(store)
}])
export default class Console extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {welcome} = this.props;
    return (
      <div>
        <Helmet title="Console"/>
        {JSON.stringify(welcome)}
      </div>
    )
  }
}
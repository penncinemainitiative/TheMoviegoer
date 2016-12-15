import React from "react"
import {asyncConnect} from "redux-connect"
import {getFeatures} from "../api/index"

@asyncConnect([{
  key: 'features',
  promise: ({params, helpers}) => getFeatures()
}])
export default class Features extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {features} = this.props;
    return (<div>Features: {JSON.stringify(features)}</div>)
  }
}
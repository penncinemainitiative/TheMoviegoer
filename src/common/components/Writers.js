import React from "react"
import {asyncConnect} from "redux-connect"
import {getWriters} from "../api/index"
import Helmet from "react-helmet"

@asyncConnect([{
  key: 'writers',
  promise: ({params, helpers}) => getWriters()
}])
export default class Writers extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {writers} = this.props;
    return (
      <div>
        <Helmet title="Writers"/>
        {writers.map(function (writer) {
          return <h4 key={writer.name}>{writer.name}</h4>
        })}
      </div>
    )
  }
}
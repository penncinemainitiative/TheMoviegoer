import React from "react"
import {asyncConnect} from "redux-connect"
import {getWriter} from "../api/author"
import Helmet from "react-helmet"

@asyncConnect([{
  key: 'writer',
  promise: ({params, helpers}) => getWriter(params.writer)
}])
export default class Writer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {writer} = this.props;
    return (
      <div>
        <Helmet title={writer.name}/>
        {JSON.stringify(writer)}
      </div>
    )
  }
}
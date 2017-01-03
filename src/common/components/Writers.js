import React from "react"
import {asyncConnect} from "redux-connect"
import {getWriters} from "../api/index"
import Helmet from "react-helmet"
import Link from "react-router/lib/Link"

@asyncConnect([{
  key: 'writers',
  promise: () => getWriters()
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
        {writers.map((writer) => {
          const authorURL = "/writer/" + writer.name.replace(" ", "");
          return <h4 key={writer.username}>
            <Link to={authorURL}>{writer.name}</Link>
          </h4>
        })}
      </div>
    )
  }
}
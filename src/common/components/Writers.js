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
      <div className="writersPage">
        <Helmet title="Writers"/>
        <div className="featured-writer"></div>
        <div className="writers-container">
          {writers.map((writer) => {
            const authorURL = "/writer/" + writer.name.replace(" ", "");
            return <div key={writer.username} className="author_card">
              <h4><Link to={authorURL}>{writer.name}</Link></h4>
              </div>
          })}
        </div>
      </div>
    )
  }
}
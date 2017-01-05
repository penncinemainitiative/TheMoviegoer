import React from "react"
import {asyncConnect} from "redux-connect"
import {getWriters, getFeaturedWriter} from "../api/index"
import Helmet from "react-helmet"
import Link from "react-router/lib/Link"

@asyncConnect([{
  key: 'writers',
  promise: () => getWriters()
}, {
  key: 'featured',
  promise: () => getFeaturedWriter()
}])
export default class Writers extends React.Component {
  render() {
    const {writers, featured} = this.props;
    return (
      <div className="writersPage">
        <Helmet title="Writers"/>
        <div className="featured-writer">
          <div className="image-wrapper"></div>
          <div className="text-wrapper">
            <h4>{featured.name}</h4>
            <p>{featured.bio}</p>
          </div>
        </div>
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
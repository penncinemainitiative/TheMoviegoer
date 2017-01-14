import React from "react"
import {asyncConnect} from "redux-connect"
import {getWriters, getFeaturedWriter} from "../api/index"
import Helmet from "react-helmet"
import Link from "react-router/lib/Link"
import {getResizedImage} from "./utils"

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
          <div className="image-wrapper">
            {getResizedImage(featured.image, 400, 400)}
          </div>
          <div className="text-wrapper">
            <h2>Featured Writer</h2>
            <div className="name-container">
              <Link to={featured.url}><h4>{featured.name}</h4></Link>
              <div className="accent"></div>
              <h5><i>Some description</i></h5>
            </div>
            <p>{featured.bio}</p>
          </div>
        </div>
        <div className="writers-container">
          {writers.map((writer) => {
            return <Link key={writer.username} to={writer.url}>
              <div className="author_card">
                <div className="image-wrapper">
                  <div className="inner-wrapper">
                    {getResizedImage(writer.image, 200, 200)}
                  </div>
                </div>
                <div className="text-wrapper">
                  <h4>{writer.name}</h4>
                </div>
              </div>
            </Link>
          })}
        </div>
      </div>
    )
  }
}
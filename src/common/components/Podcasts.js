import React from "react"
import {asyncConnect} from "redux-connect"
import Helmet from "react-helmet"
import {getRecentPodcasts} from "../api/index"
import Link from "react-router/lib/Link"
import {getResizedImage} from "./utils"

@asyncConnect([{
  promise: ({store: {getState, dispatch}}) => {
    if (getState().recentPodcasts.podcasts.length === 0) {
      return dispatch(getRecentPodcasts());
    } else {
      return Promise.resolve();
    }
  }
}], (state) => ({
  podcasts: state.recentPodcasts.podcasts,
  offset: state.recentPodcasts.offset
}))
export default class Podcasts extends React.Component {
  constructor(props) {
    super(props);
    this.requestMorePodcasts = this.requestMorePodcasts.bind(this);
  }

  requestMorePodcasts() {
    this.props.dispatch(getRecentPodcasts());
  }

  render() {
    const {podcasts, offset} = this.props;
    return (
      <div className="articlesPage">
        <Helmet title="Podcasts"
                meta={[
                  {
                    property: "description",
                    content: "Listen to The Moviegoer's staff discuss contemporary and classic films."
                  },
                ]}/>
        <div className="articles">
          {podcasts.map((article) => {
            const innerHTML = {__html: article.title};
            return <div key={article.articleId} className="list-article">
              <Link to={article.url}>
                <div className="image-wrapper">
                  <div className="inner-wrapper">
                    {getResizedImage(article.image, 600, 600)}
                  </div>
                </div>
              </Link>
              <div className="text-container">
                <h3><Link to={article.url}
                          dangerouslySetInnerHTML={innerHTML}></Link></h3>
                <h5><span>{article.pubDate}</span> - {article.name}</h5>
                <p>{article.excerpt}</p>
              </div>
            </div>
          })}
          {podcasts.length >= offset ?
            <div className="more-button" onClick={this.requestMorePodcasts}>
              <p>More?</p>
            </div>
            : null }
        </div>
      </div>
    )
  }
}

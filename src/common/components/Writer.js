import React from "react"
import {asyncConnect} from "redux-connect"
import {getWriter} from "../api/author"
import Helmet from "react-helmet"
import jwt_decode from "jwt-decode"

@asyncConnect([{
    key: 'writer',
    promise: ({params}) => getWriter(params.writer)
  }],
  state => {
    return {token: state.token};
  })
export default class Writer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {writer, token} = this.props;
    const author = token ? jwt_decode(token) : {};
    const loggedIn = author.username === writer.username;
    return (
      <div className="writerPage">
        <Helmet title={writer.name}/>
        <div className="bio-container">
          <div className="image-wrapper"></div>
          <div className="text-wrapper">
              <h4>{writer.name}</h4>
              <p>{writer.bio}</p>
          </div>
        </div>
        <div className="articles-container">
          <ul>
            {writer.articles.map((article) => {
              const innerHTML = {__html: article.title};
              return <li key={article.title}
                         dangerouslySetInnerHTML={innerHTML}></li>
            })}
          </ul>
        </div>
      </div>
    )
  }
}
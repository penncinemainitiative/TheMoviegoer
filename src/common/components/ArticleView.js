import React from "react"
import marked from "marked"
import Link from "react-router/lib/Link"
import jwt_decode from "jwt-decode"
import {getResizedImage} from "./utils"
import { FacebookButton, TwitterButton, EmailButton } from "react-social"

const trackShare = (channel, url) => () => {
  if (process.env.NODE_ENV === 'production' && window.ga) {
    window.ga('send', 'event', 'share', channel, url);
  }
};

class ShareButtons extends React.Component{
  render() {
    const {article} = this.props;
    const message = "Check out this article on The Moviegoer!";
    return (
      <span>
        <FacebookButton title="Share via Facebook" appId='132619720416789' message={message}
                        url={article.url} element="a" className="share" onClick={trackShare('facebook', article.url)}>
          <i className="fa fa-facebook-square"/>
        </FacebookButton>
        <TwitterButton title="Share via Twitter" url={article.url} message={message} element="a"
                       className="share"  onClick={trackShare('twitter', article.url)}>
          <i className="fa fa-twitter-square"/>
        </TwitterButton>
        <EmailButton title="Share via E-Mail" url={article.url} message={message} element="a"
                     className="share"  onClick={trackShare('email', article.url)}>
          <i className="fa fa-at"/>
        </EmailButton>
      </span>
    );
  }
}

export default class ArticleView extends React.Component {
  render() {
    const {article, token, archive} = this.props;
    const title = {__html: article.title};
    const author = token ? jwt_decode(token) : false;
    const text = {__html: marked(article.text.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"))};
    const draftUrl = `/draft/${article.articleId}`;
    return (
      <div className="articlePage">
        <div className="article_content">
          <div className="image-wrapper">
            {getResizedImage(article.image, 800, 600)}
          </div>
          <div className="title">
            <h4 dangerouslySetInnerHTML={title}></h4>
            <h5><Link to={article.authorUrl}>{article.name}</Link> - {article.pubDate} <ShareButtons article={article}/> {author.can_edit_published ?
                <Link to={draftUrl}>Edit</Link> : null}</h5>
          </div>
          <div dangerouslySetInnerHTML={text}></div>
        </div>
        {article.authorImage ?
          <div className="author_card">
            <div className="image-wrapper">
              {getResizedImage(article.authorImage, 400, 600)}
            </div>
            <div className="text-container">
              <Link to={article.authorUrl}><h3>{article.name}</h3></Link>
              <p>{article.bio}</p>
            </div>
          </div> : null}
        {archive ?
          <div className="archive">
            <div className="title-wrapper"><h3>Archive</h3></div>
            {archive.map((article) => {
              const innerHTML = {__html: article.title};
              return <div key={article.articleId} className="content-wrapper">
                <Link to={article.url}>
                  <div className="image-wrapper">
                    {getResizedImage(article.image, 200, 200)}
                  </div>
                  <div className="text-wrapper">
                    <h3 dangerouslySetInnerHTML={innerHTML}></h3>
                    <h5><span>{article.pubDate}</span> - {article.name}</h5>
                  </div>
                </Link>
              </div>
            })}
          </div> : null }
        {archive ?
          <div className="comments">
            <div id="fb-root"></div>
            <div id="comments" className="fb-comments" data-href={article.url}
                 data-width="100%" data-numposts="5"></div>
          </div> : null}
      </div>
    )
  }
}
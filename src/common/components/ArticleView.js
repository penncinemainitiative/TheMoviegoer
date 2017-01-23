import React from "react"
import marked from "marked"
import Link from "react-router/lib/Link"
import jwt_decode from "jwt-decode"
import Helmet from "react-helmet"
import {getResizedImage, get800WidthUrl} from "./utils"

const defaultDescription = "The Moviegoer is a student-run blog dedicated to film appreciation - " +
  "posting film analyses, reviews, previews, and all things related. " +
  "It is run by the Penn Cinema Initiative.";

export default class ArticleView extends React.Component {
  render() {
    const {article, token, archive} = this.props;
    const title = {__html: article.title};
    const author = token ? jwt_decode(token) : false;
    const description = article.excerpt ? article.excerpt : defaultDescription;
    const cleanTitle = article.title.replace(/(<([^>]+)>)/ig, "");
    const text = {__html: marked(article.text.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"))};
    const draftUrl = `/draft/${article.articleId}`;
    const ldJson = `
    {
      "@context": "http://schema.org",
      "@type": "Article",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${article.url}"
      },
      "headline": "${cleanTitle}",
      "image": {
        "@type": "ImageObject",
        "url": "${get800WidthUrl(article.image)}",
        "width": 800,
        "height": 450
      },
      "datePublished": "${new Date(article.pubDate).toISOString()}",
      "dateModified": "${new Date(article.updateDate).toISOString()}",
      "author": {
        "@type": "Person",
        "name": "${article.name}"
      },
       "publisher": {
        "@type": "Organization",
        "name": "The Moviegoer",
        "logo": {
          "@type": "ImageObject",
          "url": "https://pennmoviegoer.com/public/images/moviegoer_black.png"
        }
      },
      "description": "${description}"
    }`;
    return (
      <div className="articlePage">
        <Helmet title={cleanTitle}
                meta={[
                  {property: "description", content: description},
                  {property: "og:description", content: description},
                  {property: "og:title", content: cleanTitle},
                  {property: "og:url", content: article.url},
                  {property: "og:image", content: article.image}
                ]}
                script={[
                  {type: "application/ld+json", innerHTML: ldJson}
                ]}/>
        <div className="article_content">
          <div className="image-wrapper">
            {getResizedImage(article.image, 800, 600)}
          </div>
          <div className="title">
            <h4 dangerouslySetInnerHTML={title}></h4>
            <h5><Link to={article.authorUrl}>{article.name}</Link>
              - {article.pubDate} {author.can_edit_published ?
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
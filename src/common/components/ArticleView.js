import React from "react"
import marked from "marked"
import Link from "react-router/lib/Link"
import jwt_decode from "jwt-decode"
import Helmet from "react-helmet"

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
    return (
      <div className="articlePage">
        <Helmet title={cleanTitle}
                meta={[
                  {property: "description", content: description},
                  {property: "og:description", content: description},
                  {property: "og:title", content: cleanTitle},
                  {property: "og:url", content: article.url},
                  {property: "og:image", content: article.image}
                ]}/>
        <div className="article_content">
          <img src={article.image}/>
          <h4 dangerouslySetInnerHTML={title}></h4>
          <h5>{article.name} - {article.pubDate}</h5>
          {author ? <Link to={draftUrl}>Edit</Link> : null}
          <div dangerouslySetInnerHTML={text}></div>
        </div>
        {article.authorImage ?
          <div className="author_card">
            <div className="image-wrapper"><img src={article.authorImage}/></div>
            <div className="text-container">
              <h3>{article.name}</h3>
              <p>{article.bio}</p>
            </div>
          </div> : null}
        {archive ?
          <div className="archive">
            <div className="title-wrapper"><h3>Archive</h3></div>
            {archive.map((article) => {
              const innerHTML = {__html: article.title};
              return <div key={article.title} className="content-wrapper">
                <Link to={article.url}>
                  <div className="image-wrapper">
                    <img src={article.image}/>
                  </div>
                  <div className="text-wrapper">
                    <h3 dangerouslySetInnerHTML={innerHTML}></h3>
                    <h5><span>{article.pubDate}</span> - {article.name}</h5>
                  </div>
                </Link>
              </div>
            })}
          </div> : null }
        {archive ? <div className="comments"></div> : null}
      </div>
    )
  }
}
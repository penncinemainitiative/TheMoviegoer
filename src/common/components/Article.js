import React from "react"
import {asyncConnect} from "redux-connect"
import {getArticle} from "../api/article"
import {getArchiveArticle} from "../api/index"
import ArticleView from "../components/ArticleView"
import Helmet from "react-helmet"
import {get800WidthUrl} from "./utils"

const defaultDescription = "The Moviegoer is a student-run blog dedicated to film appreciation - " +
  "posting film analyses, reviews, previews, and all things related. " +
  "It is run by the Penn Cinema Initiative.";

@asyncConnect([{
    key: 'article',
    promise: ({params}) =>
      getArticle(params.year, params.month, params.day, params.slug)
  }, {
    key: 'archive',
    promise: () => getArchiveArticle()
  }],
  state => ({token: state.token})
)
export default class Article extends React.Component {
  componentDidMount() {
    if (typeof FB !== 'undefined' && FB !== null) {
      FB.XFBML.parse();
    }
  }

  componentDidUpdate() {
    if (typeof FB !== 'undefined' && FB !== null) {
      FB.XFBML.parse();
    }
  }

  render() {
    const {article} = this.props;
    const description = article.excerpt ? article.excerpt : defaultDescription;
    const cleanTitle = article.title.replace(/(<([^>]+)>)/ig, "");
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
    return <div>
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
      <ArticleView {...this.props}/>
    </div>
  }
}
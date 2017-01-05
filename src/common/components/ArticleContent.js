import React from "react"
import marked from "marked"
import Link from "react-router/lib/Link"

export default class ArticleContent extends React.Component {
  render() {
    const {article, showEdit} = this.props;
    const title = {__html: article.title};
    const text = {__html: marked(article.text.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"))};
    const draftUrl = `/draft/${article.articleId}`;
    return (
      <div className="article_content">
        <img src={article.image}/>
        <h4 dangerouslySetInnerHTML={title}></h4>
        <h5>{article.name} - {article.pubDate}</h5>
        {showEdit ? <Link to={draftUrl}>Edit</Link> : null}
        <div dangerouslySetInnerHTML={text}></div>
      </div>
    )
  }
}
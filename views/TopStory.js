import React, { Component } from 'react';
import SideBar from './SideBar';

export default class TopStory extends Component {
  render() {
    var classes;
    if (this.props.size === 'half') {
      classes = 'col-sm-6';
    } else if (this.props.size === 'third') {
      classes = 'col-md-4 col-sm-6 col-xs-12';
    } else {
      classes = 'col-sm-12';
    }
    var title = {__html: this.props.title};
    var authorUrl = '/writer/' + this.props.authorname.replace(/\s+/g, '');
    return (
      <div className="top-story">
        <div className={classes}>
          <div>
            <a href={this.props.url}>
              <img src={this.props.image} className={this.props.classes} alt="Article image" style={{width: '100%'}}/>
            </a>
            <div className="topStoryTitle spacebelow">
              <h3><a href={this.props.url}
                     className="black" dangerouslySetInnerHTML={title}></a>
              </h3>
              <h4>
                <small>{this.props.pubDate}</small>
                <a className="black" href={authorUrl}>{this.props.authorname}</a></h4>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
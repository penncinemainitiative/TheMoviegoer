'use strict';

var React = require('react');
var SideBar = require('./SideBar.jsx');

var TopStory = React.createClass({
  render: function () {
    var classes;
    if (this.props.size === 'half') {
      classes = 'col-sm-6';
    } else if (this.props.size === 'third') {
      classes = 'col-md-4 col-sm-6 col-xs-12';
    } else {
      classes = 'col-sm-12';
    }
    var title = {__html: this.props.title};
    return (
      <div className="top-story">
        <div className={classes}>
          <div>
            <a href={this.props.url}>
              <img src={this.props.image} alt="" style={{width: '100%'}}/>
            </a>
            <div className="col-sm-offset-1 col-sm-10 spacebelow">
              <h3><a href={this.props.url}
                     className="black" dangerouslySetInnerHTML={title}></a>
              </h3>
              <h4>
                <small>{this.props.pubDate}</small>
                {this.props.authorname}</h4>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = TopStory;
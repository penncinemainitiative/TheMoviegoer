'use strict';

var React = require('react');
var Layout = require('./Layout');
var Pagination = require('./Pagination');

var FeatureImage = React.createClass({
  render: function () {
    return (
      <div className={this.props.imageClasses}>
        <a href={this.props.url}><img className="largeImg"
                                      src={this.props.image} alt=""
                                      style={{width: '100%'}}/></a>
      </div>
    );
  }
});

var FeatureText = React.createClass({
  render: function () {
    var title = {__html: this.props.title};
    var authorUrl = '/writer/' + this.props.authorname.replace(/\s+/g, '');
    return (
      <div className={this.props.textClasses}>
        <h3><a href={this.props.url} dangerouslySetInnerHTML={title}></a></h3>
        <h4>
          <small>{this.props.pubDate}</small> <a href={authorUrl}>{this.props.authorname}</a>
        </h4>
        <p>{this.props.excerpt}</p>
      </div>
    );
  }
});

var Features = React.createClass({
  render: function () {
    var imageClasses = 'col-lg-8 col-md-8 col-sm-8 col-xs-12';
    var textClasses = 'col-lg-4 col-md-4 col-sm-4 col-xs-12';
    return (
      <Layout {...this.props}>
        <div className="container">
          <div className="title">Features</div>
          <Pagination {...this.props}/>
          {this.props.features.map(function (feature, i) {
            if (i % 2 === 0) {
              feature.imageClasses = imageClasses + ' col-lg-push-4';
              feature.textClasses = textClasses + ' col-lg-pull-8';
            } else {
              feature.imageClasses = imageClasses;
              feature.textClasses = textClasses;
            }
            return (
              <div className="feature-story">
                <div className="row">
                  <FeatureImage {...feature}/>
                  <FeatureText {...feature}/>
                </div>
              </div>
            );
          })}
        </div>
      </Layout>
    );
  }
});

module.exports = Features;
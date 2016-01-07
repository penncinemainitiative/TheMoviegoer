'use strict';

var React = require('react');
var Layout = require('./Layout');
var Pagination = require('./Pagination');

var FeatureImage = React.createClass({
  render: function () {
    return (
      <div className="col-sm-8 col-xs-12">
        <a href={this.props.url}><img src={this.props.image} alt=""
                                      style={{width: '100%'}}/></a>
      </div>
    );
  }
});

var FeatureText = React.createClass({
  render: function () {
    var title = {__html: this.props.title};
    return (
      <div className="col-sm-4 col-xs-12">
        <h3><a href={this.props.url} dangerouslySetInnerHTML={title}></a></h3>
        <h4>
          <small>{this.props.pubDate}</small> {this.props.authorname}
        </h4>
        <p>{this.props.excerpt}</p>
      </div>
    );
  }
});

var Features = React.createClass({
  render: function () {
    return (
      <Layout {...this.props}>
        <div className="container">
          <div className="title">Features</div>
          <Pagination {...this.props}/>
          {this.props.features.map(function (feature, i) {
            if (i % 2 !== 0) {
              return (
                <div className="feature-story">
                  <div className="row">
                    <FeatureImage {...feature}/>
                    <FeatureText {...feature}/>
                  </div>
                </div>
              );
            } else {
              return (
                <div className="feature-story">
                  <div className="row">
                    <FeatureText {...feature}/>
                    <FeatureImage {...feature}/>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </Layout>
    );
  }
});

module.exports = Features;
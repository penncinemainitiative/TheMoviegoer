import React, { Component } from 'react';
import Layout from './Layout';
import View from './View';

export default class Article extends Component {
  render() {
    return (
      <Layout {...this.props}>
        <div className="container article">
          <View {...this.props}>
            <div className="fb-comments" data-href={this.props.url}
                 data-width="100%" data-numposts="5"></div>
          </View>
        </div>
      </Layout>
    );
  }
}
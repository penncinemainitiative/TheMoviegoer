import React, { Component } from 'react';
import Layout from './Layout';

export default class ErrorPage extends Component {
  render() {
    return (
      <Layout {...this.props}>
        <div className="title">Not Found</div>
      </Layout>
    );
  }
}
import React, { Component } from 'react';
import Layout from './Layout';
import ArticleList from './ArticleList';
import AuthorList from './AuthorList';

export default class Home extends Component {
  render() {
    return (
      <Layout {...this.props}>
        <div id="home" className="container">
          <div className="title">Author Console</div>
          <h4>Welcome, {this.props.name}!</h4>
          <ArticleList {...this.props}/>
          { this.props.isEditor === 2 ? <AuthorList {...this.props}/> : null }
        </div>
      </Layout>
    );
  }
}
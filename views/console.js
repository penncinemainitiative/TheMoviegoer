import React, { Component } from 'react';
import Layout from './Layout';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Alert from 'react-bootstrap/lib/Alert';

export default class Console extends Component {
  render() {
    return (
      <Layout {...this.props}>
        <div id="console" className="container">
          <div className="title">Login</div>
          <form id="loginForm">
            <Input name="username" type="text" placeholder="Username"/>
            <Input name="password" type="password" placeholder="Password"/>
            <Button type="submit">Login</Button>
            <Button href="/console/signup">Become an author!</Button>
          </form>
          <Alert bsStyle="danger"/>
        </div>
      </Layout>
    );
  }
}
import React, { Component } from 'react';
import Layout from './Layout';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Alert from 'react-bootstrap/lib/Alert';

export default class Signup extends Component {
  render() {
    return (
      <Layout {...this.props}>
        <div id="console" className="container">
          <div className="title">Become an author!</div>
          <form id="signupForm">
            <Input type="email" name="email" placeholder="Email"/>
            <Input type="text" name="name" placeholder="Name"/>
            <Input type="text" name="username" placeholder="Username"/>
            <Input type="password" name="password" placeholder="Password"/>
            <Input type="password" name="passwordConfirm"
                   placeholder="Confirm password"/>
            <Button type="submit">Sign up</Button>
          </form>
          <Alert bsStyle="danger"/>
        </div>
      </Layout>
    );
  }
}
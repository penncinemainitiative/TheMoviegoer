import React from "react"
import Helmet from "react-helmet"
import {Button} from "react-bootstrap"
import Link from "react-router/lib/Link"
import browserHistory from "react-router/lib/browserHistory"
import cookie from "react-cookie"
import {connect} from "react-redux"
import {login} from "../api/index"
import {loginWithToken, logout} from "../actions/auth"

@connect()
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {username: '', password: '', message: ''};
  }

  handleSubmit(e) {
    e.preventDefault();
    login(this.state.username, this.state.password)
      .then(({data}) => {
        if (data.success) {
          this.props.dispatch(loginWithToken(data.token));
          browserHistory.push('/console');
        } else {
          this.setState(Object.assign({}, this.state, {message: data.msg}));
        }
      })
  }

  updatePassword(e) {
    this.setState(Object.assign({}, this.state, {password: e.target.value}));
  }

  updateUsername(e) {
    this.setState(Object.assign({}, this.state, {username: e.target.value}));
  }

  logout() {
    cookie.remove('authToken', {path: '/'});
    this.props.dispatch(logout());
    browserHistory.push('/');
  }

  render() {
    return (
      <div>
        <Helmet title="Login"/>
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.updateUsername} value={this.state.username}
                 type="text" placeholder="Username"/>
          <input onChange={this.updatePassword} value={this.state.password}
                 type="password" placeholder="Password"/>
          <Button type="submit">Login</Button>
          <Link to="/console/signup">Become an author!</Link>
        </form>
        <div>{this.state.message}</div>
        <Button onClick={this.logout}>Logout</Button>
      </div>
    );
  }
}
import React from "react"
import Helmet from "react-helmet"
import Link from "react-router/lib/Link"
import browserHistory from "react-router/lib/browserHistory"
import cookie from "react-cookie"
import {asyncConnect} from "redux-connect"
import {login, sendPassword} from "../api/index"
import {loginWithToken, logout} from "../actions/auth"
import {userLogout} from "./utils"

@asyncConnect([])
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
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

  forgotPassword() {
    if (this.state.email !== '') {
      cookie.remove('token', {path: '/'});
      this.props.dispatch(logout());
      sendPassword(this.state.username).then(({data}) => {
        this.setState(Object.assign({}, this.state, {message: data.msg}));
      });
    }
  }

  render() {
    return (
      <div className="loginPage">
        <Helmet title="Login"
                meta={[
                  {
                    property: "description",
                    content: "Login to the author's console."
                  },
                ]}/>
        <div>
          <form onSubmit={this.handleSubmit}>
            <input id="username" onChange={this.updateUsername}
                   value={this.state.username}
                   type="text" placeholder="Username"/>
            <input id="password" onChange={this.updatePassword}
                   value={this.state.password}
                   type="password" placeholder="Password"/>
            <button id="login" type="submit">Login</button>
          </form>
        </div>
        <button><Link to="/signup">Become an author!</Link></button>
        <div>
          Forgot your password? Type in your username in the above field.
          <button onClick={this.forgotPassword} type="submit">Recover my password</button>
        </div>
        <div>{this.state.message}</div>
        <button onClick={userLogout.bind(null, this.props.dispatch)}>Logout</button>
      </div>
    );
  }
}
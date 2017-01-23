import React from "react"
import Helmet from "react-helmet"
import {signup} from "../api/index"

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateName = this.updateName.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.updateConfirmedPassword = this.updateConfirmedPassword.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.state = {
      name: '',
      username: '',
      password: '',
      confirmedPassword: '',
      email: '',
      message: ''
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.password !== this.state.confirmedPassword) {
      this.setState(Object.assign({}, this.state, {message: "Your passwords don't match!"}));
      return;
    }
    signup(this.state.name, this.state.username, this.state.password, this.state.email)
      .then(({data}) => {
        this.setState(Object.assign({}, this.state, {message: data.msg}));
      })
  }

  updatePassword(e) {
    this.setState(Object.assign({}, this.state, {password: e.target.value}));
  }

  updateUsername(e) {
    this.setState(Object.assign({}, this.state, {username: e.target.value}));
  }

  updateConfirmedPassword(e) {
    this.setState(Object.assign({}, this.state, {confirmedPassword: e.target.value}));
  }

  updateEmail(e) {
    this.setState(Object.assign({}, this.state, {email: e.target.value}));
  }

  updateName(e) {
    this.setState(Object.assign({}, this.state, {name: e.target.value}));
  }

  render() {
    return (
      <div>
        <Helmet title="Signup"
                meta={[
                  {
                    property: "description",
                    content: "Become a writer at The Moviegoer!"
                  },
                ]}/>
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.updateName} value={this.state.name}
                 type="text" placeholder="Name"/>
          <input onChange={this.updateUsername} value={this.state.username}
                 type="text" placeholder="Username"/>
          <input onChange={this.updateEmail} value={this.state.email}
                 type="text" placeholder="Email"/>
          <input onChange={this.updatePassword} value={this.state.password}
                 type="password" placeholder="Password"/>
          <input onChange={this.updateConfirmedPassword}
                 value={this.state.confirmedPassword}
                 type="password" placeholder="Confirm password"/>
          <button type="submit">Signup</button>
        </form>
        <div>{this.state.message}</div>
      </div>
    );
  }
}
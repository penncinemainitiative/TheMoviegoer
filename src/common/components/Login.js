import React from "react"
import Helmet from "react-helmet"
import {Button} from "react-bootstrap"
import {Link} from "react-router"
import {http} from "../api/index"

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.state = {username: '', password: ''};
  }

  handleSubmit(e) {
    e.preventDefault();
    http
      .post('/api/login', {
        username: this.state.username,
        password: this.state.password
      })
      .then(({data}) => {
        console.log(data);
      })
  }

  updatePassword(e) {
    this.setState({
      username: this.state.username,
      password: e.target.value
    });
  }

  updateUsername(e) {
    this.setState({
      username: e.target.value,
      password: this.state.password
    });
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
      </div>
    );
  }
}
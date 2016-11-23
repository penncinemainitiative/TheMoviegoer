import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'

class HelloMessage extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}

class App extends React.Component {
  render() {
    return (
        <div>
        <h1>App</h1>
        <ul>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/inbox">Inbox</Link></li>
        <li><Link to="/console">Console</Link></li>
        </ul>
        {this.props.children}
        </div>
        )
  }
}

class Home extends React.Component {
  render() {
    return (<div>Home</div>)
  }
}

class About extends React.Component {
  render() {
    return (<div>About</div>)
  }
}

class Inbox extends React.Component {
  render() {
    return (<div>Inbox</div>)
  }
}

class Console extends React.Component {
  render() {
    return (<div>Console</div>)
  }
}

var requireAuth = function(nextState, replace) {
  if (Math.ceil(Math.random() * 3) == 2) {
    replace({
      pathname: "/"
    })
  }
}

module.exports = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="about" component={About} />
      <Route path="inbox" component={Inbox} />
      <Route path="console" component={Console} onEnter={requireAuth} />
    </Route>
  </Router>
)

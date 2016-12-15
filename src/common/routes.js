import React from 'react'
import { Route, IndexRoute, Link } from 'react-router'
import Index from './components/Index'

class App extends React.Component {
  render() {
    return (
        <div>
        <h1>App</h1>
        <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/inbox">Inbox</Link></li>
        <li><Link to="/console">Console</Link></li>
        </ul>
        {this.props.children}
        </div>
        )
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

const requireAuth = function(nextState, replace) {
  if (Math.ceil(Math.random() * 3) == 2) {
    replace({
      pathname: "/"
    })
  }
};

export default () => {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Index} />
      <Route path="about" component={About} />
      <Route path="inbox" component={Inbox} />
      <Route path="console" component={Console} onEnter={requireAuth} />
    </Route>
  );
}
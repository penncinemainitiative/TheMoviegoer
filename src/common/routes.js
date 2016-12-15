import React from "react"
import {Route, IndexRoute, Link} from "react-router"
import Index from "./components/Index"
import About from "./components/About"
import Article from "./components/Article"

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>App</h1>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
        {this.props.children}
      </div>
    )
  }
}

export default () => {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Index}/>
      <Route path="about" component={About}/>
      <Route path="/:year/:month/:day/:slug" component={Article}/>
    </Route>
  );
}
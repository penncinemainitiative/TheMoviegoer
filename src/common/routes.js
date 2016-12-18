import React from "react"
import {Route, IndexRoute} from "react-router"
import Index from "./components/Index"
import About from "./components/About"
import Article from "./components/Article"
import Header from "./components/Header"
import Login from "./components/Login"
import Console from "./components/Console"

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        {this.props.children}
      </div>
    )
  }
}

const authenticate = (nextState, replace, callback) => {
  // replace('/about');
};

export default () => {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Index}/>
      <Route path="about" component={About}/>
      <Route path="login" component={Login}/>
      <Route path="console" component={Console} onEnter={authenticate}/>
      <Route path=":year/:month/:day/:slug" component={Article}/>
    </Route>
  );
}
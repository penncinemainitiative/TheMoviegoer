import React from "react"
import {Route, IndexRoute} from "react-router"
import Index from "./components/Index"
import About from "./components/About"
import Article from "./components/Article"
import Header from "./components/Header"

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

export default () => {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Index}/>
      <Route path="about" component={About}/>
      <Route path=":year/:month/:day/:slug" component={Article}/>
    </Route>
  );
}
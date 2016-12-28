import React from "react"
import Route from "react-router/lib/Route"
import IndexRoute from "react-router/lib/IndexRoute"
import Index from "./components/Index"
import About from "./components/About"
import Article from "./components/Article"
import Header from "./components/Header"
import Login from "./components/Login"
import Console from "./components/Console"
import PageNotFound from "./components/PageNotFound"
import Writers from "./components/Writers"
import Writer from "./components/Writer"

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

const authenticate = (store) => {
  return (nextState, replace) => {
    const state = store.getState();
    if (!state.authToken) {
      replace({
        pathname: '/login'
      });
    }
  };
};

export default (store) => {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Index}/>
      <Route path="about" component={About}/>
      <Route path="writers" component={Writers}/>
      <Route path="login" component={Login}/>
      <Route path="console" component={Console} onEnter={authenticate(store)}/>
      <Route path=":year/:month/:day/:slug" component={Article}/>
      <Route path="writer/:writer" component={Writer}/>
      <Route path="*" component={PageNotFound}/>
    </Route>
  );
}
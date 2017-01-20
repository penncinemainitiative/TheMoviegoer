import React from "react"
import Index from "../components/Index"
import About from "../components/About"
import Article from "../components/Article"
import Header from "../components/Header"
import Login from "../components/Login"
import Signup from "../components/Signup"
import PageNotFound from "../components/PageNotFound"
import Writers from "../components/Writers"
import Writer from "../components/Writer"
import Articles from "../components/Articles"
import Footer from "../components/Footer"
import {ConsoleRoute} from "./ConsoleRoute"
import {DraftRoute} from "./DraftRoute"

if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

class App extends React.Component {
  render() {
    return (
      <div>
        <Header/>
        {this.props.children}
        <Footer/>
      </div>
    )
  }
}

const authenticate = (store) => {
  return (nextState, replace) => {
    const state = store.getState();
    if (!state.token) {
      replace({
        pathname: '/login'
      });
    }
  };
};

const AboutRoute = {
  path: 'about',
  component: About
};

const WritersRoute = {
  path: 'writers',
  component: Writers
};

const ArticlesRoute = {
  path: 'articles',
  component: Articles
};

const LoginRoute = {
  path: 'login',
  component: Login
};

const SignupRoute = {
  path: 'signup',
  component: Signup
};

const AuthRoutes = (store) => ({
  onEnter: authenticate(store),
  getChildRoutes(location, cb) {
    cb(null, [ConsoleRoute, DraftRoute])
  }
});

const ArticleRoute = {
  path: ':year/:month/:day/:slug',
  component: Article
};

const WriterRoute = {
  path: 'writer/:writer',
  component: Writer
};

const PageNotFoundRoute = {
  path: '*',
  component: PageNotFound
};

export default (store) => ({
  path: '/',
  component: App,
  indexRoute: {
    component: Index
  },
  childRoutes: [
    AboutRoute,
    WritersRoute,
    ArticlesRoute,
    LoginRoute,
    SignupRoute,
    AuthRoutes(store),
    ArticleRoute,
    WriterRoute,
    PageNotFoundRoute
  ]
});
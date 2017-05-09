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
import Helmet from "react-helmet"

if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

class App extends React.Component {
  render() {
    return (
      <div>
        <Helmet
          titleTemplate="%s | The Moviegoer"
          defaultTitle="The Moviegoer"/>
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
    require.ensure([], (require) =>
      cb(null, [
          require('./ConsoleRoute').default,
          require('./DraftRoute').default,
          require('./UserManagementRoute').default
        ]
      )
    )
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
    ArticleRoute,
    WriterRoute,
    AuthRoutes(store),
    {
      path: "movies*", onEnter: (_, replace) => replace({
      pathname: '/articles'
    })
    },
    {
      path: "features*", onEnter: (_, replace) => replace({
      pathname: '/articles'
    })
    },
    PageNotFoundRoute
  ]
});
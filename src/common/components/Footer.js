import React from "react"
import Link from "react-router/lib/Link"

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="footer">
        <div className="text-container">
          <p>The Moviegoer is a student-run blog dedicated to film appreciation
            - posting film analyses, reviews, previews, and all things related.
            If you
            would like to work with us, please find out more under the about
            tab.
            The Moviegoer is generously sponsored by
            <a href="http://www.writing.upenn.edu/~wh/"> The Kelly Writers
              House </a>
            at the University of Pennsylvania.</p>
          <p>
            <a target="_blank" href="https://www.facebook.com/PennMovieGoer/">
              <img src="/public/images/facebook-logo.png"/>
            </a>
          </p>
          <div>
            <p><span>Webmaster: dlakata (at) seas (dot) upenn (dot) edu</span>
            </p>
            <p>
              <span>Front-End by: bradpett (at) sas (dot) upenn (dot) edu</span>
            </p>
          </div>
          <p><span><Link to="/console">Go to Author Console</Link></span></p>
        </div>
      </div>
    );
  }
}

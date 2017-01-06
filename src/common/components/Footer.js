import React from "react"
import Link from "react-router/lib/Link"

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="footer">
        <p>The Moviegoer is a student-run blog dedicated to film appreciation 
        - posting film analyses, reviews, previews, and all things related. If you 
        would like to work with us, please find out more under the about tab. 
        The Moviegoer is generously sponsored by the The Kelly Writers House at 
        the University of Pennsylvania.</p>
        <Link to="/console">Console</Link>
      </div>
    );
  }
}

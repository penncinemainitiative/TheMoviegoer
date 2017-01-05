import React from "react"
import Link from "react-router/lib/Link"

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Link to="/console">Console</Link>
      </div>
    );
  }
}

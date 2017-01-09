import React from "react"
import Helmet from "react-helmet"
import {asyncConnect} from "redux-connect"
import {getStaff} from "../api/index"

const positionOrdering = [
  "Editor-in-Chief",
  "Managing Editor",
  "Head Copyeditor",
  "Head of Press Outreach",
  "Treasurer",
  "Social Chair"
];

@asyncConnect([{
  key: 'staff',
  promise: () => getStaff(positionOrdering)
}])
export default class About extends React.Component {
  render() {
    const {staff} = this.props;
    return (
      <div className="aboutPage">
        <Helmet title="About"/>
        <div className="content-left">
          <div className="letter">
            <h3>Letter from the Editor</h3>
          </div>
          <div className="contact">
            <h3>Contact Us</h3>
          </div>
        </div>
        <div className="staff">
          <h3>Staff</h3>
          {staff.map((writer) => {
            return (
              <p key={writer.name}>
                <b>{writer.position}</b>: {writer.name}
              </p>
            );
          })}
        </div>
      </div>
    )
  }
}
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
            <h3>About</h3>
            <p>The Moviegoer is a student-run blog dedicated 
            to film appreciation - posting film analyses, reviews, previews, 
            and all things related. If you would like to work with us, 
            please find out more under the about tab. The Moviegoer is 
            generously sponsored by the The Kelly Writers House at the University 
            of Pennsylvania.</p>
          </div>
          <div className="contact">
            <h3>Contact Us</h3>
            <p>If you would like to work with The Moviegoer, 
            either by writing for us or by aiding in web development, 
            please contact our Editor-in-Chief, Brad Pettigrew 
            (bradpett at sas dot upenn).</p>
          </div>
        </div>
        <div className="staff">
          <h3>Staff</h3>
          {staff.map((writer) => {
            return (
                <div key={writer.name} className="author_card">
                  <div className="image-wrapper">
                    <div className="inner-wrapper"><img src={writer.image}/></div>
                  </div>
                  <div className="text-wrapper">
                    <p><b>{writer.position}</b>: {writer.name}</p>
                  </div>
                </div>
            );
          })}
        </div>
      </div>
    )
  }
}
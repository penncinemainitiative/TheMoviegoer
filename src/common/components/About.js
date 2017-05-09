import React from "react"
import Helmet from "react-helmet"
import {asyncConnect} from "redux-connect"
import Link from "react-router/lib/Link"
import {getAboutText, getStaff} from "../api/about"
import {allAuthors} from "../api/index"
import {getResizedImage} from "./utils"
import jwt_decode from "jwt-decode"
import marked from "marked"
import Select from "react-select"

const positionOrdering = [
  "Editor-in-Chief",
  "Managing Editor",
  "Head Copyeditor",
  "Head of Press Outreach",
  "Treasurer",
  "Social Chair"
];

@asyncConnect([{
  key: 'text',
  promise: () => getAboutText()
}, {
  key: 'staff',
  promise: () => getStaff(positionOrdering)
}, {
  key: 'authors',
  promise: () => allAuthors()
}],
  state => ({
    token: state.token
  })
)
export default class About extends React.Component {
  constructor(props) {
    super(props);
    this.saveChanges = this.saveChanges.bind(this);
    const {text} = this.props;
    this.state = {
      about: text.find((obj) => obj.field === "about").description,
      contact: text.find((obj) => obj.field === "contact").description
    };
  }

  saveChanges() {

  }

  render() {
    const {token, staff, text, authors} = this.props;
    const author = token ? jwt_decode(token) : undefined;
    const editable = author ? author.can_edit_about : false;
    const aboutText = text.find((obj) => obj.field === "about").description;
    const contactText = text.find((obj) => obj.field === "contact").description;
    const aboutHtml = {__html: marked(aboutText)};
    const contactHtml = {__html: marked(contactText)};
    return (
      <div className="aboutPage">
        <Helmet title="About"
                meta={[
                  {
                    property: "description",
                    content: "Learn more about the staff of The Moviegoer and how to get involved."
                  },
                ]}/>
        {editable ? <div><button onClick={this.saveChanges}>Save</button></div> : null}
        <div className="content-left">
          <div className="letter">
            <h3>About</h3>
            {editable ? <textarea cols="50" rows="10" defaultValue={this.state.about}/> :
              <div dangerouslySetInnerHTML={aboutHtml}/> }
          </div>
          <div className="contact">
            <h3>Contact Us</h3>
            {editable ? <textarea cols="50" rows="5" defaultValue={this.state.contact}/> :
             <div dangerouslySetInnerHTML={contactHtml}/> }
          </div>
        </div>
        <div className="staff">
          <h3>Staff</h3>
          {staff.map((writer) => {
            return (
              <div key={writer.name} className="author_card">
                <div className="image-wrapper">
                  <div className="inner-wrapper">
                    {getResizedImage(writer.image, 200, 200)}
                  </div>
                </div>
                <div className="text-wrapper">
                  {editable ?
                    <div style={{width: "300px"}}>
                      <b>{writer.position}</b>: <Select
                        menuContainerStyle={{zIndex: 500}}
                        clearable={false}
                        noResultsText="No results found!"
                        value={writer.username}
                        options={authors}/>
                    </div>
                     :
                    <p><Link to={writer.url}><b>{writer.position}</b>: {writer.name}</Link></p>
                    }
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )
  }
}
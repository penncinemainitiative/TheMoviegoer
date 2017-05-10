import React from "react"
import Helmet from "react-helmet"
import {asyncConnect} from "redux-connect"
import Link from "react-router/lib/Link"
import {getAboutText, getStaff, saveAboutText, saveAboutPosition} from "../api/about"
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
  promise: ({store: {dispatch}}) => dispatch(getAboutText())
}, {
  promise: ({store: {dispatch}}) => dispatch(getStaff(positionOrdering))
}, {
  key: 'authors',
  promise: () => allAuthors()
}],
  state => ({
    token: state.token,
    staff: state.about.staff,
    aboutText: state.about.aboutText.description,
    contactText: state.about.contactText.description
  })
)
export default class About extends React.Component {
  constructor(props) {
    super(props);
    this.saveChanges = this.saveChanges.bind(this);
    this.updateAboutText = this.updateAboutText.bind(this);
    this.updateContactText = this.updateContactText.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    const {aboutText, contactText} = this.props;
    this.state = {
      aboutText,
      contactText
    };
  }

  updateAboutText(e) {
    this.setState(Object.assign({}, this.state, {aboutText: e.target.value}));
  }

  updateContactText(e) {
    this.setState(Object.assign({}, this.state, {contactText: e.target.value}));
  }

  updatePosition(position, e) {
    saveAboutPosition(e.value, position, this.props.token).then(() => {
      this.props.dispatch(getStaff(positionOrdering));
    })
  }

  saveChanges() {
    const {token} = this.props;
    saveAboutText(this.state.aboutText, this.state.contactText, token).then(() => {
      this.props.dispatch(getAboutText());
    })
  }

  render() {
    const {token, staff, aboutText, contactText, authors} = this.props;
    const author = token ? jwt_decode(token) : undefined;
    const editable = author ? author.can_edit_about : false;
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
            {editable ? <textarea cols="50" rows="10" onChange={this.updateAboutText} defaultValue={aboutText}/> :
              <div dangerouslySetInnerHTML={aboutHtml}/> }
          </div>
          <div className="contact">
            <h3>Contact Us</h3>
            {editable ? <textarea cols="50" rows="5" onChange={this.updateContactText} defaultValue={contactText}/> :
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
                        onChange={this.updatePosition.bind(null, writer.position)}
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
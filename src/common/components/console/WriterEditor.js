import React from "react"
import {updateBio, updatePassword, updatePhoto} from "../../api/author"
import Link from "react-router/lib/Link"
import Dropzone from "react-dropzone"

export default class WriterEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.chooseBio = this.chooseBio.bind(this);
    this.choosePhoto = this.choosePhoto.bind(this);
    this.choosePassword = this.choosePassword.bind(this);
    this.updateBio = this.updateBio.bind(this);
    this.updateName = this.updateName.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updateCurrentPassword = this.updateCurrentPassword.bind(this);
    this.updateNewPassword = this.updateNewPassword.bind(this);
    this.updateConfirmedPassword = this.updateConfirmedPassword.bind(this);
    this.updateAccentColor = this.updateAccentColor.bind(this);
    this.updateHometown = this.updateHometown.bind(this);
    this.updateAllowFeaturedWriter = this.updateAllowFeaturedWriter.bind(this);
    this.onDrop = this.onDrop.bind(this);
    const {writer} = this.props;
    this.state = {
      editing: false,
      option: "bio",
      currentPassword: "",
      newPassword: "",
      confirmedPassword: "",
      bio: writer.bio,
      name: writer.name,
      email: writer.email,
      hometown: writer.hometown,
      accent_color: writer.accent_color,
      allow_featured_writer: writer.allow_featured_writer === 1,
      message: ""
    }
  }

  handleEdit() {
    const {writer, token} = this.props;
    if (this.state.option === "bio") {
      updateBio(token,
        writer.username,
        this.state.name,
        this.state.email,
        this.state.bio,
        this.state.hometown,
        this.state.allow_featured_writer ? 1 : 0,
        this.state.accent_color).then(() => {
        this.setState(Object.assign({}, this.state, {editing: !this.state.editing}));
      });
    } else if (this.state.option === "password") {
      if (this.state.newPassword !== this.state.confirmedPassword) {
        this.setState(Object.assign({}, this.state, {message: "New passwords don't match!"}));
      } else {
        updatePassword(token, writer.username, this.state.currentPassword, this.state.newPassword).then((data) => {
          this.setState(Object.assign({}, this.state, {message: data.message}));
        });
      }
    }
  }

  choosePassword() {
    this.setState(Object.assign({}, this.state, {option: "password"}));
  }

  chooseBio() {
    this.setState(Object.assign({}, this.state, {option: "bio"}));
  }

  choosePhoto() {
    this.setState(Object.assign({}, this.state, {option: "photo"}));
  }

  updateCurrentPassword(e) {
    this.setState(Object.assign({}, this.state, {currentPassword: e.target.value}));
  }

  updateNewPassword(e) {
    this.setState(Object.assign({}, this.state, {newPassword: e.target.value}));
  }

  updateConfirmedPassword(e) {
    this.setState(Object.assign({}, this.state, {confirmedPassword: e.target.value}));
  }

  updateBio(e) {
    this.setState(Object.assign({}, this.state, {bio: e.target.value}));
  }

  updateName(e) {
    this.setState(Object.assign({}, this.state, {name: e.target.value}));
  }

  updateEmail(e) {
    this.setState(Object.assign({}, this.state, {email: e.target.value}));
  }

  onDrop(files) {
    const {writer, token} = this.props;
    const file = files[0];
    updatePhoto(token, writer.username, file).then(() => {
      this.setState(Object.assign({}, this.state, {message: "Uploaded!"}));
    });
  }

  updateHometown(e) {
    this.setState(Object.assign({}, this.state, {hometown: e.target.value}));
  }

  updateAccentColor(e) {
    const value = e.target.value;
    if (value.startsWith("#")) {
      this.setState(Object.assign({}, this.state, {
        accent_color: value,
        message: ""
      }));
    } else {
      this.setState(Object.assign({}, this.state, {message: "Incorrect color value"}));
    }
  }

  updateAllowFeaturedWriter() {
    this.setState(Object.assign({}, this.state, {
      allow_featured_writer: !this.state.allow_featured_writer
    }));
  }

  render() {
    return (
      <div className="writer-editor">
        <button onClick={this.handleEdit}>
          {this.state.editing ? "Save" : "Update account"}
        </button>
        {this.state.editing ?
          <div>
            <p>{this.state.message}</p>
            <button onClick={this.chooseBio}>
              Bio
            </button>
            <button onClick={this.choosePhoto}>
              Photo
            </button>
            <button onClick={this.choosePassword}>
              Password
            </button>
            <div>
              {this.state.option === "bio" ?
                <div>
                  <p>
                    <input type="text" value={this.state.name}
                           onChange={this.updateName}/>
                  </p>
                  <p>
                    <input type="text" value={this.state.email}
                           onChange={this.updateEmail}/>
                  </p>
                  <p>
                    <input type="text" value={this.state.hometown}
                           placeholder="Hometown"
                           onChange={this.updateHometown}/>
                  </p>
                  <p>
                    <input type="text" value={this.state.accent_color}
                           placeholder="Accent color"
                           onChange={this.updateAccentColor}/>
                  </p>
                  <p>
                    Allow profile to be featured on <Link to="/writer">writers
                    page</Link>?
                    <input type="checkbox"
                           checked={this.state.allow_featured_writer}
                           onChange={this.updateAllowFeaturedWriter}/>
                  </p>
                  <textarea id="bio" rows="10" cols="50" value={this.state.bio}
                            onChange={this.updateBio}/>
                </div> : null}
              {this.state.option === "photo" ?
                <div>
                  <Dropzone onDrop={this.onDrop}>
                    <div>Drop or click to upload your new profile image (.png or
                      .jpg)
                    </div>
                  </Dropzone>
                </div> : null}
              {this.state.option === "password" ?
                <div>
                  <p>
                    Current password:
                    <input type="password" value={this.state.currentPassword}
                           onChange={this.updateCurrentPassword}/>
                  </p>
                  <p>
                    New password:
                    <input type="password" value={this.state.newPassword}
                           onChange={this.updateNewPassword}/>
                  </p>
                  <p>
                    Confirm new password:
                    <input type="password" value={this.state.confirmedPassword}
                           onChange={this.updateConfirmedPassword}/>
                  </p>
                </div> : null}
            </div>
          </div> : null}
      </div>
    );
  }
}
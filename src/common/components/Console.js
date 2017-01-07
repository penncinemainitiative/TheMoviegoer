import React from "react"
import {asyncConnect} from "redux-connect"
import {getAllUnpublishedArticles} from "../api/console"
import {
  getMyUnpublishedArticles,
  getWriterByName,
  updateBio,
  updatePassword,
  updatePhoto
} from "../api/author"
import {newArticle, deleteArticle} from "../api/article"
import Helmet from "react-helmet"
import jwt_decode from "jwt-decode"
import Link from "react-router/lib/Link"
import browserHistory from "react-router/lib/browserHistory"
import Dropzone from "react-dropzone"

class WriterEditor extends React.Component {
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
      message: ""
    }
  }

  handleEdit() {
    const {writer, token} = this.props;
    if (this.state.option === "bio") {
      updateBio(token, writer.username, this.state.name, this.state.email, this.state.bio).then(() => {
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
    } else if (this.state.option === "photo") {

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

  render() {
    return (
      <div>
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
                  <textarea rows="10" cols="50" value={this.state.bio}
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

@asyncConnect([],
  state => ({token: state.token})
)
class ArticleList extends React.Component {
  constructor(props) {
    super(props);
    this.handleDeleteArticle = this.handleDeleteArticle.bind(this);
  }

  handleDeleteArticle(id) {
    const {token} = this.props;
    deleteArticle(token, id).then(() => {
      this.props.dispatch(getAllUnpublishedArticles());
      this.props.dispatch(getMyUnpublishedArticles());
    });
  }

  render() {
    const {articles, username} = this.props;
    return (
      <table>
        <thead>
        <tr>
          <th>Title</th>
          <th>Last updated</th>
          <th>Author</th>
          <th>Delete</th>
        </tr>
        </thead>
        <tbody>
        {articles.map(function (article) {
          const title = {__html: article.title};
          const draftUrl = `/draft/${article.articleId}`;
          return <tr key={article.articleId}>
            <td><Link to={draftUrl}>
              <span dangerouslySetInnerHTML={title}/>
            </Link></td>
            <td>{article.updateDate}</td>
            <td>{article.name}</td>
            <td>{username === article.author ?
              <button
                onClick={this.handleDeleteArticle.bind(null, article.articleId)}>
                Delete</button> : null}</td>
          </tr>;
        }.bind(this))}
        </tbody>
      </table>
    );
  }
}

@asyncConnect([{
    promise: ({store: {dispatch}}) => dispatch(getAllUnpublishedArticles())
  }, {
    promise: ({store: {dispatch}}) => dispatch(getMyUnpublishedArticles())
  }, {
    key: 'writer',
    promise: ({store: {getState}}) => getWriterByName(jwt_decode(getState().token).name)
  }],
  state => ({
    token: state.token,
    allUnpublished: state.console.allUnpublishedArticles,
    myUnpublished: state.console.myUnpublishedArticles
  })
)
export default class Console extends React.Component {
  constructor(props) {
    super(props);
    this.handleNewArticle = this.handleNewArticle.bind(this);
  }

  handleNewArticle() {
    const {token} = this.props;
    newArticle(token).then(({data}) => {
      browserHistory.push(`/draft/${data.articleId}`);
    });
  }

  render() {
    const {allUnpublished, myUnpublished, token, writer} = this.props;
    const author = jwt_decode(token);
    return (
      <div>
        <Helmet title="Console"/>
        <h4>Welcome, {author.name}!</h4>
        <Link to={writer.url}>My profile</Link>
        <WriterEditor writer={writer} token={token}/>
        <button onClick={this.handleNewArticle}>New article</button>
        <h5>My unpublished articles</h5>
        <ArticleList articles={myUnpublished} username={author.username}/>
        <h5>All unpublished articles</h5>
        <ArticleList articles={allUnpublished} username={author.username}/>
      </div>
    )
  }
}
import React from "react"
import Helmet from "react-helmet"
import {asyncConnect} from "redux-connect"
import {getUsers, getRoles, changeUserRole, changePermission, deleteUser} from "../../api/console"
import Select from "react-select"

@asyncConnect([{
  promise: ({store: {dispatch}}) => dispatch(getUsers())
}, {
  promise: ({store: {dispatch}}) => dispatch(getRoles())
}],
  state => ({
    token: state.token,
    users: state.console.users,
    roles: state.console.roles
  })
)
export default class UserManagement extends React.Component {
  constructor(props) {
    super(props);
    this.updateRole = this.updateRole.bind(this);
    this.updatePermission = this.updatePermission.bind(this);
    this.deleteAuthor = this.deleteAuthor.bind(this);
    this.state = {message: ''};
  }

  updateRole(username, e) {
    const {token} = this.props;
    const role = e.value;
    changeUserRole(token, username, role).then(() => {
      this.props.dispatch(getUsers());
    });
  }

  updatePermission(role, permission, enabled) {
    const {token} = this.props;
    changePermission(token, role, permission, enabled).then(() => {
      this.props.dispatch(getRoles());
    });
  }

  deleteAuthor(username) {
    const {token} = this.props;
    deleteUser(token, username).then((data) => {
      if (data.success) {
        this.props.dispatch(getUsers());
      } else {
        this.setState(Object.assign({}, this.state, {message: data.err}));
      }
    });
  }

  render() {
    const {users, roles} = this.props;
    const uniqueRoles = [... new Set(roles.map((role) => role.role))];
    const options = uniqueRoles.map((role) => {
      return {value: role, label: role}
    });
    return (
      <div >
        <Helmet title="User Management"/>
        <div>{this.state.message}</div>
        <h3>Users</h3>
        <table>
          <tbody>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Delete</th>
          </tr>
          {users.map(function (user) {
            return <tr key={user.username}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td style={{width: "300px"}}>
                <Select
                  menuContainerStyle={{zIndex: 500}}
                  clearable={false}
                  noResultsText="No results found!"
                  value={user.role}
                  onChange={this.updateRole.bind(null, user.username)}
                  options={options}/>
              </td>
              <td><button onClick={this.deleteAuthor.bind(null, user.username)}>Delete</button></td>
            </tr>
          }.bind(this))}
          </tbody>
        </table>
        <h3>Roles</h3>
        <table>
          <tbody>
          <tr>
            <th>Role</th>
            <th>Can assign author</th>
            <th>Can assign editor</th>
            <th>Can delete articles</th>
            <th>Can edit published</th>
            <th>Can publish</th>
            <th>Can edit about page</th>
          </tr>
          {roles.map(function (role) {
            return <tr key={role.role}>
              <td>{role.role}</td>
              <td><input type="checkbox" checked={role.can_assign_author}
                         onChange={this.updatePermission.bind(null, role.role, "can_assign_author", !role.can_assign_author)}/></td>
              <td><input type="checkbox" checked={role.can_assign_editor}
                         onChange={this.updatePermission.bind(null, role.role, "can_assign_editor", !role.can_assign_editor)}/></td>
              <td><input type="checkbox" checked={role.can_delete_articles}
                         onChange={this.updatePermission.bind(null, role.role, "can_delete_articles", !role.can_delete_articles)}/></td>
              <td><input type="checkbox" checked={role.can_edit_published}
                         onChange={this.updatePermission.bind(null, role.role, "can_edit_published", !role.can_edit_published)}/></td>
              <td><input type="checkbox" checked={role.can_publish}
                         onChange={this.updatePermission.bind(null, role.role, "can_publish", !role.can_publish)}/></td>
              <td><input type="checkbox" checked={role.can_edit_about}
                         onChange={this.updatePermission.bind(null, role.role, "can_edit_about", !role.can_edit_about)}/></td>
            </tr>
          }.bind(this))}
          </tbody>
        </table>
      </div>
    )
  }
}
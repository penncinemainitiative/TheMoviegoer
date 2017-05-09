import React from "react"
import Helmet from "react-helmet"
import {asyncConnect} from "redux-connect"
import {getUsers, getRoles} from "../../api/console"
import Select from "react-select"

@asyncConnect([{
  key: 'users',
  promise: ({store: {getState}, params}) => getUsers(getState().token)
}, {
  key: 'roles',
  promise: ({store: {getState}, params}) => getRoles(getState().token)
}])
export default class UserManagement extends React.Component {
  constructor(props) {
    super(props);
    this.updateRole = this.updateRole.bind(this);
    this.updatePermission = this.updatePermission.bind(this);
  }

  updateRole(username) {

  }

  updatePermission(role, permission) {

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
        <h3>Users</h3>
        <table>
          <tbody>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
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
                  options={options}/>
              </td>
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
                         onChange={this.updatePermission.bind(null, role.role, "can_assign_author")}/></td>
              <td><input type="checkbox" checked={role.can_assign_editor}
                         onChange={this.updatePermission.bind(null, role.role, "can_assign_editor")}/></td>
              <td><input type="checkbox" checked={role.can_delete_articles}
                         onChange={this.updatePermission.bind(null, role.role, "can_delete_articles")}/></td>
              <td><input type="checkbox" checked={role.can_edit_published}
                         onChange={this.updatePermission.bind(null, role.role, "can_edit_published")}/></td>
              <td><input type="checkbox" checked={role.can_publish}
                         onChange={this.updatePermission.bind(null, role.role, "can_publish")}/></td>
              <td><input type="checkbox" checked={role.can_edit_about}
                         onChange={this.updatePermission.bind(null, role.role, "can_edit_about")}/></td>
            </tr>
          }.bind(this))}
          </tbody>
        </table>
      </div>
    )
  }
}
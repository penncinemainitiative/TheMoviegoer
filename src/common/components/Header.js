import React from "react"
import Link from "react-router/lib/Link"
import browserHistory from "react-router/lib/browserHistory"
import Select from "react-select"
import {searchArticles} from "../api/index"

class HeaderItem extends React.Component {
  render() {
    return (
      <div className="nav_item">
        <h5><Link to={this.props.url}>{this.props.name}</Link></h5>
      </div>
    );
  }
}

const onSelect = (clicked) => {
  browserHistory.push(clicked.value);
};

export default class Header extends React.Component {
  render() {
    const items = [
      {name: 'Articles', url: '/articles'},
      {name: 'Writers', url: '/writers'},
      {name: 'About', url: '/about'}
    ];
    return (
      <div className="nav">
        <Link to="/" className="logo">
          <img src="/public/images/moviegoer_black.png"
               alt="The Moviegoer"/></Link>
        <div className="container">
          {items.map((item) => {
            return <HeaderItem {...item} key={item.name}/>;
          })}
          <div className="search_bar">
            <Select.Async
              name="form-field-name"
              placeholder="Search for articles"
              noResultsText="No results found!"
              onChange={onSelect}
              loadOptions={searchArticles}/>
          </div>
        </div>
      </div>
    );
  }
}

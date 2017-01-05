import React from "react"
import Link from "react-router/lib/Link"
import browserHistory from "react-router/lib/browserHistory"

class HeaderItem extends React.Component {
  render() {
    return (
      <div className="nav_item">
        <h5><Link to={this.props.url}>{this.props.name}</Link></h5>
      </div>
    );
  }
}

export default class Header extends React.Component {
  componentDidMount() {
    const search = $('#search');
    search.select2({
      width: '100%',
      placeholder: 'Search articles',
      escapeMarkup: (m) => m,
      ajax: {
        cache: true,
        delay: 250,
        type: 'GET',
        url: '/api/search',
        processResults: (data) => ({
          results: $.map(data, (obj) => {
            if ('title' in obj) {
              return {id: obj.url, text: obj.title};
            } else {
              const url = `/writer/${obj.name.replace(/\s+/g, '')}`;
              return {id: url, text: `<b>Author</b>: ${obj.name}`};
            }
          })
        })
      }
    });
    search.on('select2:select', (e) => {
      browserHistory.push(e.target.value);
    });
  }

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
            <select id="search" className="form-control"/>
          </div>
        </div>
      </div>
    );
  }
}

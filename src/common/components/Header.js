import React from "react"
import Row from "react-bootstrap/lib/Row"
import Link from "react-router/lib/Link"
import browserHistory from "react-router/lib/browserHistory"

class HeaderItem extends React.Component {
  render() {
    return (
      <div className='headerItem col-lg-1 col-md-1 col-sm-1 col-xs-2'>
        <h5><Link to={this.props.url}>{this.props.name}</Link></h5>
      </div>
    );
  }
}

export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const search = $('#search');
    search.select2({
      placeholder: 'Search articles',
      escapeMarkup: function (m) {return m;},
      ajax: {
        cache: true,
        delay: 250,
        type: 'GET',
        url: '/api/search',
        processResults: function (data) {
          return {
            results: $.map(data, function(obj) {
              if ('title' in obj) {
                return { id: obj.url, text: obj.title };
              } else {
                const url = '/writer/' + obj.name.replace(/\s+/g, '');
                return { id: url, text: '<b>Author</b>: ' + obj.name };
              }
            })
          };
        }
      }
    });
    search.on('select2:select', function(e) {
      browserHistory.push(e.target.value);
    });
  }

  render() {
    const style = {
      backgroundColor: '#2b292b',
      color: '#c29d52',
      minHeight: '4em',
      width: '100%'
    };
    const logoStyle = {
      height: '42px',
      marginTop: '15px',
      marginBottom: '12px'
    };
    const items = [
      {name: 'Login', url: '/login'},
      {name: 'Console', url: '/console'},
      {name: 'Articles', url: '/articles'},
      {name: 'Writers', url: '/writers'},
      {name: 'About', url: '/about'}
    ];
    return (
      <Row style={style}>
        <Link to="/"
              className="col-lg-1 col-md-2 col-sm-2 col-xs-3 col-lg-offset-2 col-md-offset-1 col-sm-offset-1">
          <img src="/public/images/logo.png" style={logoStyle}
               alt="The Moviegoer"/></Link>
        {items.map((item) => {
          return <HeaderItem {...item} key={item.name}/>;
        })}
        <div className='searchBar col-lg-3 col-md-3 col-sm-3 col-xs-8 col-lg-offset-0 col-md-offset-0 col-sm-offset-0'>
          <select id="search" className="form-control"/>
        </div>
      </Row>
    );
  }
}

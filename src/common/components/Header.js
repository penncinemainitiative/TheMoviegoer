import React from "react"
import Row from "react-bootstrap/lib/Row"
import Link from "react-router/lib/Link"

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
    this.state = {active: 0};
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
      </Row>
    );
  }
}

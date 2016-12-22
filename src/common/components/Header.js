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
    this.state = {mounted: false};
  }

  componentDidMount() {
    this.setState({mounted: true});
  }

  render() {
    const items = [
      {name: 'The Moviegoer', url: '/'},
      {name: 'Login', url: '/login'},
      {name: 'Console', url: '/console'},
      {name: 'Writers', url: '/writers'},
      {name: 'About', url: '/about'}
    ];
    return (
      <div id="header">
        <Row>
          {items.map(function (item) {
            return <HeaderItem {...item} key={item.name}/>;
          })}
        </Row>
      </div>
    );
  }
}

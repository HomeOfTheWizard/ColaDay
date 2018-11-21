import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../../routes';
import web3 from '../../ethereum/web3';


class Header extends Component {

  state = { address: [] };

  async componentWillMount(){
    const accounts = await web3.eth.getAccounts();
    this.setState({address: accounts});
  }

  render(){
    return (
      <Menu style={{ marginTop: '10px'}}>
        <div >
        <Link route="/">
          <a className="item">Cola Day Planner</a>
        </Link>
        </div>

        <Menu.Menu position="right">
          <Link route={`/reservations/${this.state.address[0]}`}>
            <a className="item">My Reservations</a>
          </Link>

          <Link route="/">
            <a className="item">+</a>
          </Link>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default Header;

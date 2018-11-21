import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import Layout from '../../components/shared/Layout';
import { Link } from '../../routes';
import meetingRoomManager from '../../ethereum/meetingRoomManager';
import web3 from '../../ethereum/web3';
import ReservationRow from '../../components/ReservationRow';

class ReservationShow extends Component {

  static async getInitialProps(props){
    const {address} = props.query;

    const roomNb = await meetingRoomManager.methods.roomNb().call();

    const roomCalendars = await Promise.all( Array(parseInt(roomNb)).fill().map( (element,index) => {
        return meetingRoomManager.methods.getRoomCalendar(index).call();
      })
    );

    const reservations = roomCalendars.filter( (roomCalendar) => {
      return ( roomCalendar.roomCalendar.includes(address) );
    }).map( roomCalendar => ({
      room: roomCalendar.roomId,
      time: roomCalendar.roomCalendar.indexOf(address)
    }));

    return { address, reservations };
  }

  renderRows(){
    return this.props.reservations.map((reservation,index) => {
      return (
        <ReservationRow
          key={index}
          id={index}
          time={reservation.time}
          room={reservation.room}
          address={this.props.address}
        />
      )
    });
  }

  render(){
    const { Header, Row, HeaderCell, Body } = Table;
    return (
      <Layout>
        <h3>My Scheduled Meetings</h3>
        <Link route="/">
          <a>Back</a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>Id</HeaderCell>
              <HeaderCell>Time</HeaderCell>
              <HeaderCell>Room</HeaderCell>
              <HeaderCell>Cancel</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
        <div>Found {this.props.reservations.length} reservation</div>
      </Layout>
    )
  }
}

export default ReservationShow;

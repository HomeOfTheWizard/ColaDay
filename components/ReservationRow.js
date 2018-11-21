import React, { Component } from 'react';
import { Table, Button, Message, Form } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import meetingRoomManager from '../ethereum/meetingRoomManager';
import { timeSlotStrArray } from './shared/timeSlotStrArray';
import { Router } from '../routes';

class ReservationRow extends Component {

  state = {
    loading: false,
    errorMessage: '',
    address: ''
  }

   async onCancel() {
    event.preventDefault();

    this.setState({ loading: true, errorMessage:'' });
    try{
      const accounts = await web3.eth.getAccounts();
      await meetingRoomManager.methods.cancelReservation(this.props.room, this.props.time).send({
        from: accounts[0]
      });
      Router.replaceRoute(`/reservations/${this.props.address}`);
    }
    catch(err){
      this.setState({ errorMessage: err.message })
    }
    this.setState({ loading: false });
  };

  render(){
    const { Row, Cell } = Table;
    const { id, time, room, address } = this.props;

    return (
      <Row>
          <Cell>{id+1}</Cell>
          <Cell>{timeSlotStrArray[time]}</Cell>
          <Cell>{parseInt(room)+1}</Cell>
          <Cell>
            <Form onSubmit = {() => { if (window.confirm('Are you sure you wish to delete this item?')) {this.onCancel();}} }
                  error = {!!this.state.errorMessage}>
              <Message error header="Oops!" content={this.state.errorMessage} />
              <Button color="teal" basic loading={this.state.loading}>
                Cancel
              </Button>
            </Form>
          </Cell>
      </Row>
    );
  }
}

export default ReservationRow;

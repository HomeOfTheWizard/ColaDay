import React, { Component } from 'react';
import { Accordion, Button, Dropdown, Form, Menu, Step, Message } from 'semantic-ui-react'
import Layout from '../components/shared/Layout';
import { timeSlotStrArray } from '../components/shared/timeSlotStrArray';
import { Link, Router } from '../routes';
import meetingRoomManager from '../ethereum/meetingRoomManager';
import web3 from '../ethereum/web3';



class ReservationIndex extends Component {

  static async getInitialProps(){
    const roomNb = await meetingRoomManager.methods.roomNb().call();
    const roomCalendars = await Promise.all( Array(parseInt(roomNb)).fill().map( (element,index) => {
        return meetingRoomManager.methods.getRoomCalendar(index).call();
      })
    );
    return { roomCalendars };
  }

  state = {
      loading: false,
      errorMessage: '',
      activeIndex: 0,
      chosenTimeIndex: '',
      roomList: [],
      chosenRoomId: 0
    }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    //check if disabled content was clicked
    //first logical close check if it is the 3rd Step
    //second logical close check for the 2nd step
    if(
        ( index!==2 || !(this.state.chosenTimeIndex==='' || this.state.chosenRoomId===0) )
        &&
        ( index!==1 || !(this.state.chosenTimeIndex==='') )
      )
      this.setState({ activeIndex: newIndex })
  }

  handleChangeRadio = (e, { value }) => {
    console.log(e.target)
    this.setState({ chosenTimeIndex: value })
    this.setState({ activeIndex: 1 })
    this.setState({ roomList: this.getRoomsAvailableAtTimeIndex(value) })

    //if you already chose a room and got back to change the time, you must recalculate the available rooms
    if(this.state.chosenRoomId && !this.state.roomList.includes(this.state.chosenRoomId))
    {
      this.setState ({ chosenRoomId: 0 })
    }
  }

  handleChangeDrop = (e, { value }) => {
    console.log(e.target)
    this.setState({ activeIndex: 2 })
    this.setState({ chosenRoomId: parseInt(value) })
  }

  onSubmit = async event => {
    event.preventDefault();
    const {chosenTimeIndex, chosenRoomId} = this.state;
    this.setState({ loading: true, errorMessage:'' });

    try{
      const accounts = await web3.eth.getAccounts();
      await meetingRoomManager.methods.reserveRoom(chosenRoomId, chosenTimeIndex).send({
        from: accounts[0]
      });
      Router.pushRoute(`/reservations/${accounts[0]}`);
    } catch (err){
      this.setState({ errorMessage: err.message })
    }

    this.setState({ loading: false });
  }



  getRoomsAvailableAtTimeIndex(timeSlotIndex){
    const roomCalendars = this.props.roomCalendars;

    var availableRooms = roomCalendars.filter( (roomCalendar) => {
      return (roomCalendar.roomCalendar[timeSlotIndex] === undefined || parseInt(roomCalendar.roomCalendar[timeSlotIndex]) === 0);
    }).map(roomCalendar => roomCalendar.roomId);

    return availableRooms;
  }

  mapArrayToDropDownOptions(array){
    return array.map(item => ({text:(parseInt(item)+1), value:item}) );
  }

  render(){
    const { chosenTimeIndex, activeIndex, chosenRoomId } = this.state;

    let dropDownOps = this.mapArrayToDropDownOptions(this.state.roomList);

    let radioOptionItems = timeSlotStrArray.map((timeSlot, index) =>
                <Form.Radio key={index}
                            value={index}
                            type='radio'
                            label={timeSlot}
                            checked={chosenTimeIndex === index}
                            onChange={this.handleChangeRadio} />
            );

    let timeSlotTitleStep = (
      <Step.Group fluid>
        <Step active={activeIndex===0}
              icon='time'
              title='Time Slot'
              description='Choose prefered timeslot'
              completed={chosenTimeIndex!==''}/>
      </Step.Group>
    )

    let RoomNumberTitle = (
        <Step.Group fluid>
         <Step active={activeIndex===1}
               icon='building'
               title='Room Number'
               description='Choose your meeting room'
               disabled={chosenTimeIndex===''}
               completed={chosenRoomId!==0}/>
        </Step.Group>
      )

    let ScheduleTitle = (
        <Step.Group fluid>
          <Step active={activeIndex===2}
                icon='calendar check outline'
                title='Schedule Meeting'
                description='Verify reservation details'
                disabled={chosenTimeIndex==='' || chosenRoomId===0}/>
        </Step.Group>
      )

    return (
      <Layout>
      <h3>Schedule a new meeting</h3>
      <div>
        <Accordion as={Menu} vertical fluid>
          <Menu.Item>
            <Accordion.Title
              active={activeIndex === 0}
              index={0}
              onClick={this.handleClick}
              content={timeSlotTitleStep}
            />
            <Accordion.Content active={activeIndex === 0}>
              <Form>
                <Form.Group grouped>
                  {radioOptionItems}
                </Form.Group>
              </Form>
            </Accordion.Content>
          </Menu.Item>

          <Menu.Item>
            <Accordion.Title
              active={activeIndex === 1}
              content={RoomNumberTitle}
              index={1}
              onClick={this.handleClick}
            />
            <Accordion.Content active={activeIndex === 1}>
              <Dropdown placeholder='Available rooms' fluid selection options={dropDownOps} onChange={this.handleChangeDrop}/>
            </Accordion.Content>
          </Menu.Item>

          <Menu.Item>
            <Accordion.Title
              active={activeIndex === 2}
              content={ScheduleTitle}
              index={2}
              onClick={this.handleClick}
            />
            <Accordion.Content active={activeIndex === 2}>
              <p>Please check one last time the details of your reservation.<br />
              If you want to modify something you can still go back on the above menus.</p>
              <p>Room number: {parseInt(this.state.chosenRoomId)+1} <br />
              Time: {timeSlotStrArray[parseInt(this.state.chosenTimeIndex)]}</p>
              <Form onSubmit={this.onSubmit}  error={!!this.state.errorMessage}>
                <Message error header="Oops!" content={this.state.errorMessage} />
                <Button
                  floated ="left"
                  content="Schedule meeting"
                  icon="add circle"
                  loading={this.state.loading}
                  primary
                  style={{marginBottom: 10}}
                />
              </Form>
            </Accordion.Content>
          </Menu.Item>
        </Accordion>
      </div>
      </Layout>
    )
  }
}

export default ReservationIndex;

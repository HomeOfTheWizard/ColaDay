const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledMRM = require('../ethereum/build/MeetingRoomManager.json');

let accounts;
let meetingRoomMngr;

beforeEach(async ()=>{
  //get ganache accounts
  //by default we have 10 different accounts
  accounts = await web3.eth.getAccounts();

  //deploy factory contract
  meetingRoomMngr = await new web3.eth.Contract(JSON.parse(compiledMRM.interface))
    .deploy({ data: compiledMRM.bytecode })
    .send({ from: accounts[0], gas: '1000000' });
});



describe('MeetingRoomManager', ()=> {
  it('deploys a meetingRoomManager', () => {
    assert.ok(meetingRoomMngr.options.address);
  });

  it('allow people to schedule a meeting', async () => {
    await meetingRoomMngr.methods.reserveRoom(0,0).send({ from:accounts[0] });

    var roomCalendarZero = await meetingRoomMngr.methods.getRoomCalendar(0).call();

    assert.equal(roomCalendarZero.roomCalendar[0], accounts[0]);
  });

  it('allow people to reserve and cancel a meeting', async () => {
    await meetingRoomMngr.methods.reserveRoom(1,1).send({ from:accounts[0] });

    await meetingRoomMngr.methods.cancelReservation(1,1).send({ from:accounts[0] });

    const room1Calendar = await meetingRoomMngr.methods.getRoomCalendar(1).call();
    assert.equal(room1Calendar.roomCalendar[1], 0);
  });
});

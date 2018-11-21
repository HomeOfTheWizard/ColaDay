import web3 from './web3';
import MeetingRoomManager from './build/MeetingRoomManager.json';

const instance = new web3.eth.Contract(
  JSON.parse(MeetingRoomManager.interface),
  '0x9A91ED29FF0560a4daaF9953b49052F314D03DBb'
);

export default instance;

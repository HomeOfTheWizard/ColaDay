const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');

fs.removeSync(buildPath);

const meetingRoomManagerPath = path.resolve(__dirname, 'contracts', 'MeetingRoomManager.sol');
const source = fs.readFileSync(meetingRoomManagerPath, 'utf8');
const output = solc.compile(source, 1).contracts;

//check if folder exists, if not create it
fs.ensureDirSync(buildPath);

console.log(output);
for(let contract in output){
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(':','')+'.json'),
    output[contract]
  );

}

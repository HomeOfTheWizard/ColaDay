#Homework project written for Consensys blockchain developper hiring
#author: Özgün OZ
#date: 16/11/2018

The ColaDay application is web app allowing to users manage meeting room reservations based on a public blockchain, ethereum.
Application is a node.js server interracting to ethereum network via web3js. client GUi is codded using Reactjs'
For this application we suppose users are handling their own ethereum accounts.

**?? HOW TO USE IT ??**
Install npm, go to project folder, and run following commands:
  npm init
  npm install
  node server.js


**?? HOW TO TEST IT ??**
launch server by running node server.js. And play with GUI on http://localhost:3000/

Or, to test the contract, you can use the test files in the project folder /test repository

1)Test ethereum components
  npm test test/ethereum/MRoomManager.test.js

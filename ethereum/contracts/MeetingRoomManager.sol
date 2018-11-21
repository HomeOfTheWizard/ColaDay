pragma solidity ^0.4.25;

contract MeetingRoomManager{

    uint public roomNb = 20;
    uint public roomCalendarSize = 10;
    mapping(uint => address[]) public roomCalendarsMap;

    function reserveRoom(uint roomIndex, uint reservationTimeslotIndex) public{
        address[] storage roomCalendar = roomCalendarsMap[roomIndex];

        require(roomIndex < roomNb);
        require(reservationTimeslotIndex < roomCalendarSize);

        if(roomCalendar.length == 0){
            roomCalendar.length = roomCalendarSize;
        }

        require(roomCalendar[reservationTimeslotIndex] == address(0));

        roomCalendar[reservationTimeslotIndex] = msg.sender;
    }

    function cancelReservation(uint roomIndex, uint reservationTimeslotIndex) public{
        address[] storage roomCalendar = roomCalendarsMap[roomIndex];

        require(roomIndex < roomNb);
        require(reservationTimeslotIndex < roomCalendarSize);

        if(roomCalendar.length == 0){
            roomCalendar.length = roomCalendarSize;
        }

        require(roomCalendar[reservationTimeslotIndex] == msg.sender);

        roomCalendar[reservationTimeslotIndex] = address(0);
    }


    function getRoomCalendar(uint roomIndex) public view returns(uint roomId, address[] roomCalendar){
        require(roomIndex < roomNb);

        roomId = roomIndex;
        roomCalendar = roomCalendarsMap[roomIndex];
    }
}

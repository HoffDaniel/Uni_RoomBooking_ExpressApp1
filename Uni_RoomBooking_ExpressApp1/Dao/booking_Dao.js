
var mysql_connection = require('./mysql_connection.js');
var mysql = require('mysql');
var room_Dao = require('./room_Dao.js');
var user_Dao = require('./user_Dao.js');


var booking = {
    get_booking_room: function (roomID, callback) {

    },
    get_booking_user: function (userID, callback) {

    },
    check_booking: function (booking_Info) {

    }

  

};

var bookingZ = {

}

//what should be exported fro, this here
module.exports.booking = booking;
module.exports.booking = bookingZ;



//const booking = [{id:1}, {id:2}, {id:3}, {id:4}];
//var booking_confirmed = true;
//for (let i = 0; i < booking.length; i++) {
//    console.log(booking[i].id);
//    booking_confirmed = true;

//    if (booking[i].id !== 1) {
//        booking_confirmed = false
//        break;
//    }
//}
//console.log("booking is:" + booking_confirmed);
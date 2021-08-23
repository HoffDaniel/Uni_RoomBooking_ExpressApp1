
var mysql_connection = require('./mysql_connection.js');
var mysql = require('mysql');
var room_Dao = require('./room_Dao.js');
var user_Dao = require('./user_Dao.js');


var booking = {
    get_booking_room: function (roomID, callback) {
        var connection = mysql_connection.mysql_connection.get_Sql_con();
        var bookings = [];
        if (connection) {
            var sql_Statement = 'SELECT * FROM bookings WHERE roomID LIKE' + mysql.escape(roomID);
            connection.query(sql_Statement, function (err, results, fields) {
                results.forEach(function (result) {
                    bookings.push(result) //Put the information in rooms
                });
                console.log("inside get_BKings")
                console.log(bookings);
                callback(bookings);
            });
        }

    },
    get_booking_user: function (userID, callback) {

    },
    check_booking: function (booking_Info) {

    },

    set_booking: function (booking_info, callback) {
        var connection = mysql_connection.mysql_connection.get_Sql_con();
        var userID = booking_info.userID;
        var roomID = booking_info.roomID;
        var date = booking_info.date;
        var timeStart = booking_info.from;
        var timeEnd = booking_info.to;
        if (connection) {
            var sql_Statement = 'INSERT INTO `db_test`.`bookings`(`userID`, `roomID`, `date`, `timeStart`, `timeEnd`) VALUES (' +
                mysql.escape(userID) + ',' +
                mysql.escape(roomID) + ',' +
                mysql.escape(date) + ',' +
                mysql.escape(timeStart) + ',' +
                mysql.escape(timeEnd);
            connection.query(sql_Statement, function (err, result) {
                if (err) throw err;
                //console.log("A booking has been succesfullyy inserteddd yay");
                callback("A booking has been succesfullyy inserteddd yay")
            }

        }


    }
    
};


module.exports.booking = booking;


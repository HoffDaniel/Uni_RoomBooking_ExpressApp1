
var mysql_connection = require('./mysql_connection.js');
var mysql = require('mysql');
var room_Dao = require('./room_Dao.js');
var user_Dao = require('./user_Dao.js');


var booking = {
    get_booking_room: function (roomID, callback) {
        var connection = mysql_connection.mysql_connection.get_Sql_con();
        var bookings = [];
        console.log(roomID);
        if (connection) {
            var sql_Statement = 'SELECT * FROM bookings WHERE roomID =' + mysql.escape(roomID);
            connection.query(sql_Statement, function (err, results, fields) {
                results.forEach(function (result) {
                   
                    const d = new Date(result.date);
                    var year = d.getFullYear();
                    var month = '' + (d.getMonth() + 1);
                    var day = '' + d.getDate();
                    if (month.length < 2) { month = '0' + month; }
                    if (day.length < 2) { day = '0' + day; }
                    const formated_date = year + "-" + month + "-" + day 

                    result.date = formated_date;//update the date in the result
                    bookings.push(result); //Put the information in rooms

                });
                console.log("inside get_BKings")
                console.log(bookings);
                callback(bookings);
            });
        };
        //Close connection
        mysql_connection.mysql_connection.close_Sql_con(connection);
    },

    get_booking_user: function (userID, callback) {
        var connection = mysql_connection.mysql_connection.get_Sql_con();
        var bookings = [];
        if (connection) {
            var sql_Statement = 'SELECT * FROM bookings where userID =' + mysql.escape(userID);
            connection.query(sql_Statement, function (err, results, fields) {
                results.forEach(function (result) {

                    console.log(result.date);
                    //Format the Date (this is only to make it more visual on the webpage, it wont affect the database)
                    const mysql_Date_formated = result.date.toDateString();//mysql_Date.substr(0, 16);
                    console.log(mysql_Date_formated);
                    //Different format
                    //const d = new Date(mysql_Date_formated);
                    //const formated_date = "" + d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();
                    //console.log(formated_date);

                    result.date = mysql_Date_formated;//update the date in the result 
                    
                    bookings.push(result); //Put the information in bookings
                });
                //console.log(bookings);
                
                callback(bookings);
            });
        };
        //Close connection
        mysql_connection.mysql_connection.close_Sql_con(connection);
    },

    cancel_booking: function (bookingID) {
        var connection = mysql_connection.mysql_connection.get_Sql_con();
        if (connection) {
            var sql_Statement = 'DELETE FROM bookings where bookingID =' + mysql.escape(bookingID);
            connection.query(sql_Statement, function (err, results, fields) {
                if (err) throw err;
                console.log("A booking has been successfullyy canceled yay");
            });
        };
        //Close connection
        mysql_connection.mysql_connection.close_Sql_con(connection);
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
                mysql.escape(timeEnd) + ')';
            connection.query(sql_Statement, function (err, result) {
                if (err) throw err;
                //console.log("A booking has been succesfullyy inserteddd yay");
                callback("A booking has been successfullyy inserteddd yay");
            });

        };
        //Close connection
        mysql_connection.mysql_connection.close_Sql_con(connection);
    }
    
};


module.exports.booking = booking;


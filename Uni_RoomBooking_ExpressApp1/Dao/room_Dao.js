
var mysql_connection = require('./mysql_connection.js')

var room_Dao = {

    //GET all rooms 
    get_Rooms_All: function (callback) {
        //Connect
        var connection = mysql_connection.mysql_connection.get_Sql_con();
        var rooms = [];
        //Query
        var sql_Statement = "SELECT * FROM inventory";
        //If succeful connection
        if (connection) {
            connection.query(sql_Statement, function (err, results, fields) {
                results.forEach(function (result) {
                    rooms.push(result) //Put the information in rooms
                });
                callback(rooms)
            });
        }
        //Close connection
        mysql_connection.mysql_connection.close_Sql_con(connection); 
    },

     get_Rooms_Where: function (srch, callback) {
        //Connect
        var connection = mysql_connection.mysql_connection.get_Sql_con();
         var rooms = [];
         //var search = callback.body; 
        //Query
        var sql_Statement = "SELECT * FROM inventory WHERE room=?";
        //If succeful connection
        if (connection) {
            connection.query(sql_Statement, srch, function (err, results, fields) {
                results.forEach(function (result) {
                    rooms.push(result) //Put the information in rooms
                });
                callback(rooms)
            });
        }
        //Close connection
        mysql_connection.mysql_connection.close_Sql_con(connection);
    }


};


module.exports.room_Dao = room_Dao;
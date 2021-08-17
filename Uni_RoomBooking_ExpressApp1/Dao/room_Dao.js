
var mysql_connection = require('./mysql_connection.js')

var room_Dao = {

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

                    rooms.push(result)

                });

                callback(rooms)

            });

        }

        mysql_connection.mysql_connection.close_Sql_con(connection); //close connection

    }



};


module.exports.room_Dao = room_Dao;
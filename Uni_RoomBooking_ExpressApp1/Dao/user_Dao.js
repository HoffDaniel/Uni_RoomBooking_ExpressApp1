var mysql_connection = require('./mysql_connection.js');
var mysql = require('mysql');

var user_Dao = {

    get_User: function (username, password, callback) {
        //Connect
        var connection = mysql_connection.mysql_connection.get_Sql_con();
        var users = [];
        //for testing only
        console.log(username);
        console.log(password);

        //If succeful connection
        if (connection) {
            //Query
            var sql_Statement = 'SELECT * FROM users WHERE username LIKE' + mysql.escape(username) + 'AND password LIKE' + mysql.escape(password);
            //console.log(sql_Statement)
            connection.query(sql_Statement, function (err, results, fields) {
                results.forEach(function (result) {
                    users.push(result) //Put the information in rooms
                });
                callback(users)
            });
        }
        //Close connection
        mysql_connection.mysql_connection.close_Sql_con(connection);
    },

}

module.exports.user_Dao = user_Dao;


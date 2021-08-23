var mysql_connection = require('./mysql_connection.js');
var mysql = require('mysql');

var user_Dao = {

    get_User: function (username, password, callback) {
        //Connect
        var connection = mysql_connection.mysql_connection.get_Sql_con();
        var users = [];
       
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

    check_User_Email: function (email, callback) {
        //Connect
        var connection = mysql_connection.mysql_connection.get_Sql_con();
        var users = [];
        
        //If succeful connection
        if (connection) {
            //Query
            var sql_Statement = 'SELECT * FROM users WHERE email LIKE' + mysql.escape(email);
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

    set_User: function (username, password, email) {
        //Connect
        var connection = mysql_connection.mysql_connection.get_Sql_con();
        //If succeful connection
        if (connection) {
            //Query
            var sql_Statement = 'INSERT INTO users(email, username, password) VALUES (' + mysql.escape(email) + ',' + mysql.escape(username) + ',' + mysql.escape(password) + ')';

            //var sql_Statement = 'INSERT INTO `db_test`.`users`(`email`, `username`, `password`) VALUES(' + mysql.escape(email) + ',' + mysql.escape(username) + ',' + mysql.escape(password) + ')';
            //console.log(sql_Statement)
            connection.query(sql_Statement, function (err, results, fields) {
                if (err) {
                    throw err;
                }
                console.log("registeredddd!");
            });
        }
        //Close connection
        mysql_connection.mysql_connection.close_Sql_con(connection);
    },
   
}

module.exports.user_Dao = user_Dao;


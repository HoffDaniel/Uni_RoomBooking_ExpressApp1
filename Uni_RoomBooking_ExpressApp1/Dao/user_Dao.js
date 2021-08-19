var mysql_connection = require('./mysql_connection.js');
var mysql = require('mysql');

var user_Dao = {

    get_User: function (username, password, callback) {
        //Connect
        var connection = mysql_connection.mysql_connection.get_Sql_con();
        var user = [];
        //for testing only
        console.log(username);
        console.log(password);

        //If succeful connection
        if (connection) {
            //Query
            var sql_Statement = 'SELECT * FROM users WHERE username=' + mysql.escape(username) + 'AND password =' + mysql.escape(password);
            console.log(sql_Statement)
            connection.query(sql_Statement, function (err, results, fields) {
                results.forEach(function (result) {
                    user.push(result) //Put the information in rooms
                });
                callback(user)
            });
        }
        //Close connection
        mysql_connection.mysql_connection.close_Sql_con(connection);
    },

}

module.exports.user_Dao = user_Dao;
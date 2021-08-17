var mysql = require('mysql');
var mysql_connection_string = require('./mysql_connection_string.js')

var mysql_connection = {

    //CONNECT function
    get_Sql_con: function () {

        var con = mysql.createConnection(mysql_connection_string.mysql_connection_string.connectionString);
        //var con = mysql.createConnection({
        //    host: "localhost",
        //    user: "root",
        //    password: "root1234",
        //    database: "db_test"
        //});

        con.connect(function (err) {
        if (err) throw err;
        console.log("Connected YehAw!");
        });

        return con;
    },

    //CLOSE CONNECTION function
    close_Sql_con: function (connection) {

        connection.end(function (err) {
            if (err) throw err;
            console.log("Disco YehAw!");
        });

    }

}

module.exports.mysql_connection = mysql_connection;




/*
//exports.con = con;
*/

/* var mySQL_connection = {
 *      connectionString : {
 *      
 *      host : ""
 *      user : ""
 *      password : ""
 *      database : ""
 *      
 *      }
 *     };
 *   exports.mySQL_connection = mySQL_connection
*/
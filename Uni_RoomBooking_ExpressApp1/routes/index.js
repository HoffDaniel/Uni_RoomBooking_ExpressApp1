'use strict';
var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var room_Dao = require('../Dao/room_Dao.js');
var user_Dao = require('../Dao/user_Dao.js');

const { search } = require('./users.js');
const { urlencoded } = require('express');

//var urlencodedParser = router.bodyParser.urlencoded({ extended: false });
//var jsonParser = router.bodyParser.json();
var user_Current = 'Current User Is Displayed here'
    

////////////////////// NORMAL PAGES STUFFF //////////////////////
/* GET ("read data") home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Final Year Project - A University Room Management System' });
});
////////////////////////////////////////////

////////////////////// STUFFF that needs database //////////////////////
/* GET a list of all rooms */
router.get('/room_List', function (req, res) {

    room_Dao.room_Dao.get_Rooms_All(
        function (rooms) {
            console.log(rooms);
            //"render" res(ponse) in 'room_List'
            res.render('room_List', { rooms: rooms });
        }
    );

});

/* GET booking page. */
router.get('/booking', function (req, res) {
    res.render('booking', { title: user_Current});
});

/* GET search page. */
router.get('/search_Results', function (req, res) {

    var rooms = [
        { id: '...', room: '...', building: '...' },
    ];
    res.render('search_Results', { rooms: rooms });
});

/* POST ("insert data") search page. */
router.post('/search_Results', jsonParser, function (req, res) {
    
    var search = req.body.search;
    console.log("Searching for rooms with..." + search);
    var search_All = '%' + search + '%'
    room_Dao.room_Dao.get_Rooms_Like(
        search_All,
        function (rooms) {
            console.log(rooms);
            //"render" res(ponse) in 'room_List'
            res.render('search_Results', { rooms: rooms });
        }
    );

    //res.render('search_Results', { title: 'Search: ' + search });
});
////////////////////////////////////////////

////////////////////// USER STUFFF //////////////////////
/* GET login page. */
router.get('/login', function (req, res) {
    var status = [
        { status: 'Pending...' }
    ];
    res.render('login', { status: status, title: });
});

/* GET register page. */
router.get('/register', function (req, res) {
    res.render('register', { title: 'Registration' });
});

/* POST check login details with database*/
router.post('/login', urlencodedParser, function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    

    user_Dao.user_Dao.get_User(
        username,
        password,
        function (users) {
            console.log(users);
            var status = [];
            if (users.length != 0) { //Not EMPTy yay search found user/login successful 
                status.push({ status: 'Successful!'})
                
                user_Current = username;
                res.render('logged_in', { title: user_Current })
            }
            else {
                status.push({ status: 'Login Failed... try again'})
                res.render('login', { status: status, title: 'FAIILLLL' });
            }
        }
    );


});
//////////////////////////////////////////// 



module.exports = router;

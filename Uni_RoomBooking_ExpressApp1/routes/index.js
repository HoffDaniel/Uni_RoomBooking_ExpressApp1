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
var booking_Dao = require('../Dao/booking_Dao.js');


const { search } = require('./users.js');
const { urlencoded } = require('express');

//var urlencodedParser = router.bodyParser.urlencoded({ extended: false });
//var jsonParser = router.bodyParser.json();
var user_Current = {
    name: "Current User Is Displayed here<- if you see this on the page click logout to login",
    isLogged: "false",
    ID: "userID"
}
//var user_Current = "Current User Is Displayed here <- if you see this on the page click logout to login";
//var logged_in = false;
    

////////////////////// Home PAGE STUFFF //////////////////////
/* GET ("read data") home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Final Year Project - A University Room Management System' });
});
////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////
////////////////////// STUFFF that needs database //////////////////////
////////////////////////////////////////////////////////////////////////////////////////

////////////////////// ROOM STUFF //////////////////////
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



/* GET search page. */
router.get('/search_Results', function (req, res) {

    var rooms = [
        { roomID: '...', room: '...', building: '...' }, //same as in database
    ];
    res.render('search_Results', { rooms: rooms });
});

/* POST ("insert data") search page. */
router.post('/search_Results', jsonParser, function (req, res) {
    
    var search = req.body.search;
    console.log("Searching for rooms with..." + search);
    room_Dao.room_Dao.get_Rooms_Like(
        search,
        function (rooms) {
            console.log(rooms);       
            res.render('search_Results', { rooms: rooms });
        }
    );
});
////////////////////////////////////////////

////////////////////// USER STUFFF //////////////////////
/* GET login page. */
router.get('/login', function (req, res) {
    var status = [
        { status: 'Pending...' }
    ];
    res.render('login', { status: status, title: 'Login' });
});

/* GET logout page. */
router.get('/logout', function (req, res) {
    var status = [
        { status: 'You just logged out...' }
    ];
    user_Current.isLogged = false;
    res.render('login', { status: status, title: 'Login' });
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
            var status = [];
            if (users.length != 0) { //Not EMPTy yay search found user/login successful 
                status.push({ status: 'Successful!'})

                user_Current.ID = users[0].userID;
                user_Current.name = users[0].username;
                user_Current.isLogged = true;
                console.log(user_Current);

                res.render('logout', { status: status, title: user_Current.name })
            }
            else {
                status.push({ status: 'Login Failed... try again'})
                res.render('login', { status: status, title: 'FAIILLLL' });
            }
        }
    );


});
//////////////////////////////////////////// 

////////////////////// BOOKING STUFF //////////////////////
/* GET booking page. */
router.get('/booking', function (req, res) {

    var status = [
        { status: 'Pending...' }
    ];

    res.render('booking', { status: status, title: user_Current.name});
});


router.post('/booking', urlencodedParser , function (req, res) {

    
    
    room_Dao.room_Dao.get_Room_ID(
        req.body.room,
        req.body.building,
        function (result) {
            var roomID = result[0].roomID;
            console.log(roomID);
            var booking = {
                userID: user_Current.ID,
                roomID: roomID,
                date: req.body.date,
                from: req.body.from,
                to: req.body.to
            };
            console.log(booking);
            booking_Dao.

           }
    );
    
    var status = [
        { status: 'Pending...' }
    ];

    

    if (user_Current.isLogged) {
        
    }
    else {
        status.push({ status: 'Booking Failed... Your are not logged in...please loggin to make a booking' });
        res.render('booking', { status: status, title: user_Current.name });
    }

    res.render('booking', { status: status, title: user_Current.name });

    //console.log(booking);
});

////////////////////////////////////////////



module.exports = router;

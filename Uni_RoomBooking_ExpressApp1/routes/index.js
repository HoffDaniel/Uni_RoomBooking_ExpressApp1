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

    var status = [
        { status: 'Pending...' }
    ];

    res.render('register', { status: status, title: 'Registration' });
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

router.post('/register', urlencodedParser, function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;

    user_Dao.user_Dao.check_User_Email(
        email,
        function (users) {
            var status = [];
            if (users.length != 0) { //Not EMPTy yay search found user/login successful 
                status.push({ status: 'This email is already taken!' })
                res.render('register', { status: status, title: "Registration" })
            }
            else {
                user_Dao.user_Dao.set_User(
                    username,
                    password,
                    email
                );
                status.push({ status: 'You have been registered now you can login' })
                res.render('register', { status: status, title: users })
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

/* GET my_Booking page. */
router.get('/my_Bookings', function (req, res) {
    booking_Dao.booking.get_booking_user(
        user_Current.ID,
        function (bookings) {
            console.log(bookings);
            res.render('my_Bookings', { bookings: bookings });
        }
    );
});


router.post('/booking', urlencodedParser , function (req, res) {
  
    var status = [
        { status: 'Pending...' }
    ];
    var room = req.body.room;
    var building = req.body.building;
    var date = req.body.date;
    var from = req.body.from;
    var to = req.body.to;
    var booking = {
        userID: user_Current.ID,
        roomID: "unknow",
        date: date,
        from: from,
        to: to
    };

    if (user_Current.isLogged) {        
        room_Dao.room_Dao.get_Room_ID(
            room,
            building,
            function (result) {
                booking.roomID = result[0].roomID;
            }
        );
        booking_Dao.booking.get_booking_room(
            booking.roomID,
            function (books) { //books should be a list of bookings for that room
                //bookingID: , userID: , roomID: , date: , timeStart: , timeEnd
                var booking_confirmed = true;
                for (let i = 0; i < books.length; i++) {
                    if (books[i].date !== booking.date)//not the same date
                    {
                        //go next
                    }
                    else {
                        if (books[i].timeStart >= booking.to) {//if our booking ends before an already active booking then that is amazing exit and check next ammointment
                            //greate go next
                        }
                        else if (books[i].timeStart < booking.to) {//else TO must be greater (if above is not true)
                            if (books[i].timeEnd >= booking.to) {
                                //terrible!!!
                                booking_confirmed = false;
                                break;
                            }
                            else {//else TO must be Greater than end time
                                if (books[i].timeEnd <= booking.from) {
                                    //greate go next
                                }
                                else {
                                    //terrible!!!
                                    booking_confirmed = false;
                                    break;
                                }
                            }
                        }
                    }
                    var booking_confirmed = true; //this will only be executed if we dont exite the for loop beforehand
                }
                if (booking_confirmed) {
                    //execute final matryoshka
                    booking_Dao.booking.set_booking(booking, function (confirmation) {
                        status.push({ status: booking_confirmed });
                        res.render('booking', { status: status, title: user_Current.name });
                    })
                }
                else {
                    status.push({ status: 'Booking Failed... Try another date/time' });
                    res.render('booking', { status: status, title: user_Current.name });
                }
            }
        )
    }
    else {
        status.push({ status: 'Booking Failed... Your are not logged in...please loggin to make a booking' });
        res.render('booking', { status: status, title: user_Current.name });
    }
});

////////////////////////////////////////////



module.exports = router;

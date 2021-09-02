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
    name: "Current User Is Displayed here<- if you see this on the page click logout or /login",
    isLogged: false,
    ID: "userID"
}
//var user_Current = "Current User Is Displayed here <- if you see this on the page click logout to login";
//var logged_in = false;
    

////////////////////// Home PAGE STUFFF //////////////////////
/* GET ("read data") home page. */
router.get('/', function (req, res) {
    res.render('index', {login: user_Current.isLogged, title: 'Final Year Project - A University Room Management System' });
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
    

    user_Dao.user_Dao.get_User_Name_Pwd(
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
    var status = [];

    user_Dao.user_Dao.get_User_Email_Name(
        email,
        username,
        function (users) {
            
            if (users.length != 0) { //Not EMPTy email or username  was found => 
                status.push({ status: 'This email or username is already taken!' })
                res.render('register', { status: status, title: "Registration" })
            }
            else {
                user_Dao.user_Dao.set_User(
                    username,
                    password,
                    email
                );
                status.push({ status: 'You have been registered now you can login' })
                res.render('register', { status: status, title: "Registration" })
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
            //console.log(bookings);
            res.render('my_Bookings', { bookings: bookings });
        }
    );
});


router.post('/booking', urlencodedParser , function (req, res) {

    // 1. We get all the booking information that was submitted
    // 2. We from the building and room we get the room ID
    // 3. Determine if the new booking crosses with other bookings (for that room) => checking date and times
    var status = [];
    var room = req.body.room;
    var building = req.body.building;
    var date = req.body.date;
    var from = req.body.from;
    var to = req.body.to;
    var booking = {
        userID: user_Current.ID,
        roomID: "unknown",
        date: date,
        from: from,
        to: to
    };

    if (user_Current.isLogged) {        
        room_Dao.room_Dao.get_Room_ID( //Get the room id to simplify things
            room,
            building,
            function (result) {
                booking.roomID = result[0].roomID; // put the found ID in the booking infor
                booking_Dao.booking.get_booking_room(// finds all the bookings with specified roomID
                    booking.roomID,
                    function (books) { //use the results to check date and times
                        //books = [{bookingID: , userID: , roomID: , date: , timeStart: , timeEnd}];
                        var booking_confirmed = true;
                       
                        for (let i = 0; i < Object.keys(books).length; i++) {
                            console.log("Entering for loop" + i);
                            
                            if (books[i].date !== booking.date)//not the same date
                            {
                                //go next
                                console.log("date is not the same proceed with booking");
                                console.log("next");
                            }
                            else {//
                                if (books[i].timeStart >= booking.to) {//if our booking ends before an already active booking then that is amazing exit and check next ammointment
                                    //greate go next
                                    console.log("this booking STARTS AFTER the END of the new booking");
                                    console.log("next");
                                }
                                else if (books[i].timeStart < booking.to) {//else TO must be greater (if above is not true)
                                    console.log("this booking STARTS BEFORE the END of the new booking")
                                    if (books[i].timeEnd >= booking.to) {
                                        //terrible!!!
                                        console.log("this booking ENDS AFTER the END of the new booking");
                                        console.log("break");
                                        booking_confirmed = false;
                                        break;
                                    }
                                    else {//else TO must be Greater than end time
                                        console.log("this booking ENDS BEFORE the END of the new booking");
                                        if (books[i].timeEnd <= booking.from) {
                                            //greate go next
                                            console.log("this booking ENDS BEFORE the START of the new booking");
                                            console.log("next");
                                        }
                                        else {
                                            //terrible!!!
                                            console.log("this booking ENDS AFTER the START of the new booking");
                                            console.log("break");
                                            booking_confirmed = false;
                                            break;
                                        }
                                    }
                                }
                            }
                            booking_confirmed = true; //this will only be executed if we dont exite the for loop beforehand
                        }
                        console.log(booking_confirmed);
                        if (booking_confirmed) {
                            //execute final matryoshka
                            booking_Dao.booking.set_booking(booking, function (confirmation) {
                                status.push({ status: 'Booking added, you can see it under My Bookings' });
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
        );

    }
    else {
        status.push({ status: 'Booking Failed... Your are not logged in...please loggin to make a booking' });
        res.render('booking', { status: status, title: user_Current.name });
    }
});


router.post('/my_Bookings', urlencodedParser, function (req, res) {

    var bookingID = req.body.bookingID;
    console.log(bookingID);

    //Cancel the selected booking
    booking_Dao.booking.cancel_booking(bookingID);

    //Display updated bookings (should be less then it was)
    booking_Dao.booking.get_booking_user(
        user_Current.ID,
        function (bookings) {
            console.log(bookings);
            res.render('my_Bookings', { bookings: bookings });
        }
    );
});

////////////////////////////////////////////



module.exports = router;

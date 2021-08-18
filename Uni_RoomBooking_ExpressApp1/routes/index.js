'use strict';
var express = require('express');
var router = express.Router();

var room_Dao = require('../Dao/room_Dao.js');




/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Final Year Project - A University Room Management System' });
});

/* GET login page. */
router.get('/login', function (req, res) {
    res.render('login', { title: 'Login' });
});

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

/* GET a list of all rooms but put it in search_Results*/
router.post('/search_Results', function (req, res) {
    let srch = req.body;

    room_Dao.room_Dao.get_Rooms_Where(
        srch,
        function (rooms) {
            
        //"render" res(ponse) in 'room_List'
        res.render('search_Results', { rooms: rooms });

    });

});



module.exports = router;

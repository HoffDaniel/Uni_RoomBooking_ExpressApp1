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

/* GET a list of rooms . */
router.get('/room_List', function (_req, res) {

    

    room_Dao.room_Dao.get_Rooms_All(function (rooms) {

        console.log(rooms);
        res.render('room_List', {rooms: rooms});

    });

});



module.exports = router;

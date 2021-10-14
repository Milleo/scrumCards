var express = require('express');
var router = express.Router();
const db = require("../database/models");

/* GET home page. */
router.get('/', function(req, res, next) {
  
  db.Room.findAll().then((results) => {
    console.log(results);
  });
  res.send("OK");
});

module.exports = router;

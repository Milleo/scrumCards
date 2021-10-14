const RoomsController = require("../controllers/RoomController");
var express = require('express');
var router = express.Router();

router.get('/', RoomsController.list);
router.post("/rooms/create", RoomsController.create);
module.exports = router;

const RoomsController = require("../controllers/RoomController");
var express = require('express');
var router = express.Router();

router.get('/', RoomsController.list);
router.get("/:uri", RoomsController.join);
router.post("/", RoomsController.create);
router.put("/:uuid", RoomsController.update);
router.delete("/:uuid", RoomsController.delete);

module.exports = router;

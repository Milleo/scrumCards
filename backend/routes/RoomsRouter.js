const RoomsController = require("../controllers/RoomController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const express = require('express');
const router = express.Router();



router.get('/', RoomsController.list);
router.get("/:uri", AuthMiddleware, RoomsController.join);
router.get("/:uri/ban/:userUUID", AuthMiddleware, RoomsController.banUser);
router.post("/", AuthMiddleware, RoomsController.create);
router.put("/:uuid", AuthMiddleware, RoomsController.update);
router.delete("/:uuid", AuthMiddleware, RoomsController.delete);

module.exports = router;

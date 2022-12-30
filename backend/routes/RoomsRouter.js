const RoomsController = require("../controllers/RoomController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const express = require('express');
const router = express.Router();
const RoundController = require("../controllers/RoundController");

router.get('/', RoomsController.list);
router.get("/:uri", AuthMiddleware, RoomsController.join);
router.get("/:uri/ban/:userUUID", AuthMiddleware, RoomsController.banUser);
router.post("/", AuthMiddleware, RoomsController.create);
router.put("/:uuid", AuthMiddleware, RoomsController.update);
router.delete("/:uuid", AuthMiddleware, RoomsController.delete);

router.use("/:uri/round/start", AuthMiddleware, RoundController.start);

module.exports = router;

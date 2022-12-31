const RoomsController = require("../controllers/RoomController");
const RoundController = require("../controllers/RoundController");
const PlayController = require("../controllers/PlayController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const express = require('express');
const router = express.Router();


router.get('/', RoomsController.list);
router.get("/:uri", AuthMiddleware, RoomsController.join);
router.get("/:uri/ban/:userUUID", AuthMiddleware, RoomsController.banUser);
router.post("/", AuthMiddleware, RoomsController.create);
router.put("/:uuid", AuthMiddleware, RoomsController.update);
router.delete("/:uuid", AuthMiddleware, RoomsController.delete);

router.post("/:uri/round/start", AuthMiddleware, RoundController.start);
router.put("/:uri/round/:uuid", AuthMiddleware, RoundController.update);
router.delete("/:uri/round/:uuid", AuthMiddleware, RoundController.delete);

router.post("/:uri/round/:uuid/play", AuthMiddleware, PlayController.play);

module.exports = router;

const RoomsController = require("../controllers/RoomController");
const RoundController = require("../controllers/RoundController");
const PlayController = require("../controllers/PlayController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const PlayValidator = require("../middlewares/validators/PlayValidator");
const express = require('express');
const router = express.Router();


router.get('/', RoomsController.list);
router.get("/:uri", AuthMiddleware, RoomsController.join);
router.get("/:uri/ban/:userUUID", AuthMiddleware, RoomsController.banUser);
router.post("/", AuthMiddleware, RoomsController.create);
router.put("/:uuid", AuthMiddleware, RoomsController.update);
router.delete("/:uuid", AuthMiddleware, RoomsController.delete);

router.get("/:uri/rounds", AuthMiddleware, RoundController.list);
router.post("/:uri/round/start", AuthMiddleware, RoundController.startRound);
router.get("/:uri/round/:uuid/end", AuthMiddleware, RoundController.endRound);
router.put("/:uri/round/:uuid", AuthMiddleware, RoundController.update);
router.delete("/:uri/round/:uuid", AuthMiddleware, RoundController.delete);

router.post("/:uri/round/:uuid/play", AuthMiddleware, PlayValidator.default, PlayController.play);

module.exports = router;

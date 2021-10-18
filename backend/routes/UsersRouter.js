const UsersController = require("../controllers/UserController");
var express = require('express');
var router = express.Router();

router.get('/', UsersController.list);
router.get('/:name', UsersController.get);
router.post("/", UsersController.create);
module.exports = router;

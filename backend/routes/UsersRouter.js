const UsersController = require("../controllers/UserController");
const UserValidator = require("../middlewares/validators/UserValidator");
const express = require('express');
const router = express.Router();

router.get('/:userName', UsersController.get);
router.get('/', UsersController.list);
router.post("/signup", UserValidator.create, UsersController.create);
router.post("/guest", UserValidator.createGuest, UsersController.createGuest);
router.post("/login", UserValidator.login, UsersController.login);
router.put("/:uuid", UserValidator.update, UsersController.update);
router.put("/:uuid/password", UserValidator.updatePassword, UsersController.updatePassword);
router.delete("/:uuid", UsersController.delete);
module.exports = router;
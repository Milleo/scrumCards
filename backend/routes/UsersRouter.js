const UsersController = require("../controllers/UserController");
const UserValidator = require("../middlewares/validators/UserValidator");
const express = require('express');
const router = express.Router();
const { checkSchema } = require("express-validator");

router.get('/:name', UsersController.get);
router.get('/', UsersController.list);
router.post("/", UserValidator.create, UsersController.create);
router.post("/guest", UserValidator.createGuest, UsersController.createGuest);
router.put("/", UserValidator.update, UsersController.update);
router.put("/password", UserValidator.updatePassword, UsersController.updatePassword);
router.delete("/", UsersController.delete);
module.exports = router;

const db = require("../database/models");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require('uuid');


const UserController = {
    list: (req,res) => {
        db.User.findAll({ attributes: ["uuid", "name", "email" ]}).then((result) => {
            res.send(200, result);
        });
    },
    get: (req,res) => {
        const { name } = req.params;
        db.User.findOne({ where: { name: name }, attributes: ["uuid", "name", "email" ]}).then((result) => {
            if(result == null)
                return res.send(404);

            res.send(200, result);
        }).catch((err) => {
            res.send(503, err);
        })
    },
    show: (req,res) => {
        res.send("OK");
    },
    create: (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        const { userName, email, password } = req.body;
        var salt = bcrypt.genSaltSync(10);
        var passwdHash = bcrypt.hashSync(password, salt);

        db.User.create({
            name: userName,
            email: email,
            password: passwdHash,
            uuid: uuidv4(),
        }).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            res.send(503, err);
        });
    },
    createGuest: (req,res) => {
        const { userName } = req.body;
        db.User.create({
            name: userName,
            uuid: uuidv4(),
        }).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            res.send(503, err);
        });
    },
    update: (req,res) => {
        const { uuid, userName, email } = req.body;
        db.User.update({
            name: userName,
            email: email
        }, { where: { uuid: uuid }}).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            res.send(503, err);
        });
    },
    updatePassword: (req, res) => {
        const { uuid, password } = req.body;
        db.User.update({ password: password }, { where: { uuid: uuid }}).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            res.send(503, err);
        });
    },
    delete: (req,res) => {
        const { uuid } = req.body;
        db.User.delete({ where: { uuid: uuid }}).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            res.send(503, err);
        });
    }
}

module.exports = UserController;
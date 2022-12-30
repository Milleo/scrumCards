const db = require("../database/models");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require('uuid');


const UserController = {
    list: (req,res) => {
        db.User.findAll({ attributes: ["uuid", "name", "email" ]}).then((result) => {
            res.status(200).send(result);
        });
    },
    get: (req,res) => {
        const { name } = req.params;
        db.User.findOne({ where: { name: name }, attributes: ["uuid", "name", "email" ]}).then((result) => {
            if(result == null)
                return res.sendStatus(404);

            res.status(200).send(result);
        }).catch((err) => {
            res.status(503).send(err);
        })
    },
    show: (req,res) => {
        res.send("OK");
    },
    create: (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.sendStatus(400).send({ errors: errors.array() });
        }
        const { userName, email, password } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const passwdHash = bcrypt.hashSync(password, salt);

        db.User.create({
            name: userName,
            email: email,
            password: passwdHash,
            uuid: uuidv4(),
        }).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            res.status(503).send(err);
        });
    },
    createGuest: (req,res) => {
        const { userName } = req.body;
        const userUUID = uuidv4();
        db.User.create({
            name: userName,
            uuid: userUUID,
        }).then(() => {
            res.status(200).send({ uuid: userUUID });
        }).catch((err) => {
            res.status(503).send(err);
        });
    },
    update: (req,res) => {
        const { userName, email } = req.body;
        const { uuid } = req.params;
        db.User.update({
            name: userName,
            email: email
        }, { where: { uuid: uuid }}).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            res.status(503).send(err);
        });
    },
    updatePassword: (req, res) => {
        const { uuid } = req.params;
        const { password } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const passwdHash = bcrypt.hashSync(password, salt);
        db.User.update({ password: passwdHash }, { where: { uuid: uuid }}).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            res.status(503).send(err);
        });
    },
    delete: (req,res) => {
        const { uuid } = req.params;
        db.User.destroy({ where: { uuid: uuid }}).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            res.status(503).send(err);
        });
    }
}

module.exports = UserController;
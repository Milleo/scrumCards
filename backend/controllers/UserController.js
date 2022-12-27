const db = require("../database/models");
const { v4: uuidv4 } = require('uuid');

const UserController = {
    list: (req,res) => {
        db.User.findAll().then((result) => {
            res.send(200, result);
        });
    },
    get: (req,res) => {
        const { name } = req.params;
        
        db.Room.findOne({ name: name }).then((result) => {
            res.send(200, result);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(503);
        })
    },
    show: (req,res) => {
        res.send("OK");
    },
    create: (req,res) => {
        const { userName } = req.body;
        db.User.create({
            name: userName,
            uuid: uuidv4(),
        }).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(503);
        });
    },
    update: (req,res) => {
        res.send("OK");
    },
    delete: (req,res) => {
        res.send("OK");
    }
}

module.exports = UserController;
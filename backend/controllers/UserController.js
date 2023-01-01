const db = require("../database/models");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const status = require("http-status");


const UserController = {
    list: (req,res) => {
        db.User.findAll({ attributes: ["uuid", "name", "email" ]}).then((result) => {
            res.status(status.OK).send(result);
        });
    },
    get: (req,res) => {
        const { name } = req.params;
        db.User.findOne({ where: { name: name }, attributes: ["uuid", "name", "email" ]}).then((result) => {
            if(result == null)
                return res.sendStatus(status.NOT_FOUND);

            res.status(status.OK).send(result);
        }).catch((err) => {
            res.status(status.INTERNAL_SERVER_ERROR).send(err);
        })
    },
    login: (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(status.BAD_REQUEST).send({ errors: errors.array() });
        }
        const { userName, email, password } = req.body;
        db.User.findOne({ where: { email: email }}).then((result) => {
            if(!bcrypt.compareSync(password, result.password))
                return res.sendStatus(status.NOT_FOUND);
            
            jwt.sign({ uuid: result.uuid, name: result.name }, process.env.JWT_SECRET_KEY, (err, token) => {
                if(err){
                    res.status(status.INTERNAL_SERVER_ERROR).send("Error generating JSON Web Token");
                    return;
                }
                
                res.set("x-access-token", token);
                res.sendStatus(status.OK);
            })
        }).catch((err) => res.sendStatus(status.NOT_FOUND));
    },
    create: (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(status.BAD_REQUEST).send({ errors: errors.array() });
        }
        const { userName, email, password } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const passwdHash = bcrypt.hashSync(password, salt);

        db.User.create({
            name: userName,
            email: email,
            password: passwdHash,
        }).then((result) => {
            jwt.sign({ uuid: result.uuid, name: result.name }, process.env.JWT_SECRET_KEY, (err, token) => {
                if(err){
                    res.status(status.INTERNAL_SERVER_ERROR).send("Error generating JSON Web Token");
                    return;
                }
                
                res.set("x-access-token", token);
                res.sendStatus(status.OK);
            });
        }).catch((err) => res.status(status.INTERNAL_SERVER_ERROR).send(err));
    },
    createGuest: (req,res) => {
        const { userName } = req.body;
        const userData = {
            name: userName,
        };

        db.User.create(userData).then((data) => {
            jwt.sign({ uuid: data.uuid, name: data.name }, process.env.JWT_SECRET_KEY, (err, token) => {
                if(err){
                    res.status(status.INTERNAL_SERVER_ERROR).send("Error generating JSON Web Token");
                    return;
                }
                
                res.set("x-access-token", token);
                res.status(status.OK).send({ uuid: data.uuid });
            })
        }).catch((err) => {
            res.status(status.INTERNAL_SERVER_ERROR).send(err);
        });
    },
    update: (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(status.BAD_REQUEST).send({ errors: errors.array() });
        }
        const { userName, email } = req.body;
        const { uuid } = req.params;
        db.User.update({
            name: userName,
            email: email
        }, { where: { uuid: uuid }}).then(() => {
            res.sendStatus(status.OK);
        }).catch((err) => {
            res.status(status.INTERNAL_SERVER_ERROR).send(err);
        });
    },
    updatePassword: (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(status.BAD_REQUEST).send({ errors: errors.array() });
        }
        const { uuid } = req.params;
        const { password } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const passwdHash = bcrypt.hashSync(password, salt);
        db.User.update({ password: passwdHash }, { where: { uuid: uuid }}).then(() => {
            res.sendStatus(status.OK);
        }).catch((err) => {
            res.status(status.INTERNAL_SERVER_ERROR).send(err);
        });
    },
    delete: (req,res) => {
        const { uuid } = req.params;
        db.User.destroy({ where: { uuid: uuid }}).then(() => {
            res.sendStatus(status.OK);
        }).catch((err) => {
            res.status(status.INTERNAL_SERVER_ERROR).send(err);
        });
    }
}

module.exports = UserController;
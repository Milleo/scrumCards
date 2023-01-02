const db = require("../database/models");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const status = require("http-status");
const { Op, where } = require("sequelize");


const UserController = {
    list: (req,res) => {
        db.User.findAll({ attributes: ["uuid", "userName", "email" ]}).then((result) => {
            res.status(status.OK).send(result);
        });
    },
    get: (req,res) => {
        const { userName } = req.params;
        db.User.findOne({ where: { userName: userName }, attributes: ["uuid", "userName", "email" ]}).then((result) => {
            if(result == null)
                return res.sendStatus(status.NOT_FOUND);

            res.status(status.OK).send(result);
        }).catch((err) => res.status(status.INTERNAL_SERVER_ERROR).send(err))
    },
    login: (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(status.BAD_REQUEST).send({ errors: errors.array() });
        }
        const { userName, email, password } = req.body;
        let whereCondition = { userName: userName };
        if(email != null)
            whereCondition = { email: email };
            
        db.User.findOne({ where: whereCondition }).then((result) => {
            if(!bcrypt.compareSync(password, result.password))
                return res.sendStatus(status.NOT_FOUND);
            
            jwt.sign({ uuid: result.uuid, userName: result.userName }, process.env.JWT_SECRET_KEY, (err, token) => {
                if(err){
                    res.status(status.INTERNAL_SERVER_ERROR).send("Error generating JSON Web Token");
                    return;
                }
                
                res.set("x-access-token", token);
                res.sendStatus(status.OK);
            })
        }).catch((err) => res.status(status.NOT_FOUND).send(err));
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
            userName: userName,
            email: email,
            password: passwdHash,
        }).then((result) => {
            jwt.sign({ uuid: result.uuid, userName: result.userName }, process.env.JWT_SECRET_KEY, (err, token) => {
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
            userName: userName,
        };

        db.User.create(userData).then((data) => {
            jwt.sign({ uuid: data.uuid, userName: data.userName }, process.env.JWT_SECRET_KEY, (err, token) => {
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
            userName: userName,
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
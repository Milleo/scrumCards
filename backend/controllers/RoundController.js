const db = require("../database/models");
const { v4: uuidv4 } = require('uuid');
const status = require("http-status");

const RoundController = {
    start: async (req, res) => {
        const lastOrder = 1;
        const { uri } = req.params;
        const { title } = req.body;
        const owner = req.userInfo;
        const ownerObj = await db.User.findOne({ where: { uuid: owner.uuid }});
        
        db.Room.findOne({ where: { uri: uri }}).then((roomObj) => {
            if(roomObj == null) return res.sendStatus(status.NOT_FOUND);
            if(roomObj.owner != ownerObj.id) return res.sendStatus(status.UNAUTHORIZED);

            db.Round.create({
                order: 1,
                title: title,
                room: roomObj.id,
                uuid: uuidv4()
            })
            .then((newRound) => res.status(status.OK).send({ uuid: newRound.uuid }))
            .catch((err) => res.status(status.INTERNAL_SERVER_ERROR).send(err));
        })
        .catch((err) => res.status(status.INTERNAL_SERVER_ERROR).send(err));
    },

    update: async (req, res) => {
        const { title } = req.body;
        const { uri, uuid } = req.params;
        const owner = req.userInfo;
        const ownerObj = await db.User.findOne({ where: { uuid: owner.uuid }});
        
        db.Room.findOne({ where: { uri: uri }}).then((roomObj) => {
            if(roomObj == null) return res.sendStatus(status.NOT_FOUND);
            if(roomObj.owner != ownerObj.id) return res.sendStatus(status.UNAUTHORIZED);

            db.Round.update({title}, { where: { uuid: uuid }})
            .then(() => res.sendStatus(status.OK))
            .catch((err) => res.status(status.INTERNAL_SERVER_ERROR).send(err))
        })
        .catch((err) => res.status(status.INTERNAL_SERVER_ERROR).send(err));
    },

    delete: async (req, res) => {
        const { uri, uuid } = req.params;
        const owner = req.userInfo;
        const ownerObj = await db.User.findOne({ where: { uuid: owner.uuid }});
        
        db.Room.findOne({ where: { uri: uri }}).then((roomObj) => {
            if(roomObj == null) return res.sendStatus(status.NOT_FOUND);
            if(roomObj.owner != ownerObj.id) return res.sendStatus(status.UNAUTHORIZED);

            db.Round.destroy({ where: { uuid: uuid }})
            .then(() => res.sendStatus(status.OK))
            .catch((err) => res.status(status.INTERNAL_SERVER_ERROR).send(err))
        })
        .catch((err) => res.status(status.INTERNAL_SERVER_ERROR).send(err));
    }
}

module.exports = RoundController;
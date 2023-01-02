const db = require("../database/models");
const status = require("http-status");

const RoundController = {
    startRound: async (req, res) => {
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
                room: roomObj.id
            })
            .then((newRound) => res.status(status.OK).send({ uuid: newRound.uuid }))
            .catch((err) => res.status(status.INTERNAL_SERVER_ERROR).send(err));
        })
        .catch((err) => res.status(status.INTERNAL_SERVER_ERROR).send(err));
    },
    endRound: async (req, res) => {
        const { uri, uuid } = req.params;
        const owner = req.userInfo;
        const ownerObj = await db.User.findOne({ where: { uuid: owner.uuid }});

        db.Room.findOne({ where: { uri: uri }}).then((roomObj) => {
            if(roomObj == null) return res.sendStatus(status.NOT_FOUND);
            if(roomObj.owner != ownerObj.id) return res.sendStatus(status.UNAUTHORIZED);

            db.Round.findOne({ where: { uuid: uuid }})
            .then(async (round) => {
                round.ended = true;
                await round.save();
                db.Play.findAll(
                    { where: { round_id: round.id },
                    include: [{ association: "user", "attributes": ["userName"] }],
                    attributes: ["cardValue"] }).then((summary) => {
                        res.status(status.OK).send(summary);
                }).catch((err) => res.status(status.INTERNAL_SERVER_ERROR).send(err));
            })
            .catch((err) => res.status(status.INTERNAL_SERVER_ERROR).send(err))
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
const db = require("../database/models")

const RoundController = {
    start: async (req, res) => {
        const lastOrder = 1;
        const { uri } = req.params;
        const { title } = req.body;
        const owner = req.userInfo;
        const ownerObj = await db.User.findOne({ where: { uuid: owner.uuid }});
        
        db.Room.findOne({ where: { uri: uri }}).then((roomObj) => {
            if(roomObj == null) return res.sendStatus(404);
            if(roomObj.owner != ownerObj.id) return res.sendStatus(403);

            db.Round.create({
                order: 1,
                title: title,
                room: roomObj.id
            })
            .then((newRound) => res.status(200).send({ id: newRound.id }))
            .catch((err) => res.status(503).send(err));
        })
        .catch((err) => res.status(503).send(err));
        
    }
}

module.exports = RoundController;
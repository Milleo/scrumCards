const db = require("../database/models");
const { v4: uuidv4 } = require('uuid');

const PlayController = {
    play: async (req, res) => {
        const player = req.userInfo;
        const { uuid, uri } = req.params;

        const user = await db.User.findOne({ where: { uuid: player.uuid }});
        if(user == null) res.status(403);
        
        const room = await db.Room.findOne(
            {
                where: { uri: uri },
                include: [{
                    association: "users",
                    where: { id: user.id }
                }]
            });
        if(room == null) res.status(404);

        const round = await db.Round.findOne({ where: { uuid: uuid }});
        if(round == null) res.status(404);

        const playUUID = uuidv4();
        const { cardValue } = req.body;
        db.Play.create({
            uuid: playUUID,
            cardValue: cardValue,
            round: round.id,
            user: room.users[0].id
        }).then(() => {
            res.status(200).send({ uuid: playUUID });
        }).catch((err) => res.status(503).send(err))
        
    }
}

module.exports = PlayController
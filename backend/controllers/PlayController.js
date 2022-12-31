const db = require("../database/models");
const { v4: uuidv4 } = require('uuid');
const status = require("http-status");

const PlayController = {
    play: async (req, res) => {
        const player = req.userInfo;
        const { uuid, uri } = req.params;

        const user = await db.User.findOne({ where: { uuid: player.uuid }});
        if(user == null) res.status(status.UNAUTHORIZED);
        
        const room = await db.Room.findOne(
            {
                where: { uri: uri },
                include: [{
                    association: "users",
                    where: { id: user.id }
                }]
            });
        if(room == null) res.status(status.NOT_FOUND);

        const round = await db.Round.findOne({ where: { uuid: uuid }});
        if(round == null) res.status(status.NOT_FOUND);

        const playUUID = uuidv4();
        const { cardValue } = req.body;
        db.Play.create({
            uuid: playUUID,
            cardValue: cardValue,
            round: round.id,
            user: room.users[0].id
        }).then(() => {
            res.status(status.OK).send({ uuid: playUUID });
        }).catch((err) => res.status(status.INTERNAL_SERVER_ERROR).send(err))
        
    }
}

module.exports = PlayController
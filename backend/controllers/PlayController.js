const db = require("../database/models");
const status = require("http-status");
const { validationResult } = require("express-validator");

const PlayController = {
    play: async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(status.BAD_REQUEST).send({ errors: errors.array() });
        }

        const player = req.userInfo;
        const { uuid, uri } = req.params;

        const user = await db.User.findOne({ where: { uuid: player.uuid }});
        if(user == null) return res.sendStatus(status.UNAUTHORIZED);
        
        const room = await db.Room.findOne({
            where: { uri: uri },
            include: [{
                association: "users",
                where: { id: user.id }
            }]
        });
        if(room == null) return res.sendStatus(status.NOT_FOUND);

        const round = await db.Round.findOne({ where: { uuid: uuid }});
        if(round == null) return res.sendStatus(status.NOT_FOUND);

        const { cardValue } = req.body;
        db.Play.create({
            cardValue: cardValue,
            round_id: round.id,
            room_id: room.id,
            user_id: room.users[0].id
        })
        .then((data) => res.status(status.OK).send({ uuid: data.uuid }))
        .catch((err) => res.status(status.INTERNAL_SERVER_ERROR).send(err))
        
    }
}

module.exports = PlayController
const db = require("../database/models");
const { v4: uuidv4 } = require('uuid');
const faker = require("faker");

const RoomController = {
    list: (req,res) => {
        db.Room.findAll().then((result) => {
            res.status(200).send(result);
        });
    },
    join: (req, res) => {
        const { uri } = req.params;
        const { role } = req.body;
        const user = req.userInfo;
        
        db.Room.findOne({ where: { uri: uri }}).then((roomObj) => {
            if(roomObj == null){
                return res.status(404).send("Room not found");
            }
            db.User.findOne({ where: { uuid: user.uuid }}).then(async (userObj) => {
                if(userObj == null){
                    return res.status(404).send("Room not found");
                }

                const joinData = await db.UsersRoom.findOne({ where: { id_user: userObj.id, id_room: roomObj.id }});
                if(joinData == null){
                    db.UsersRoom.create({
                        banned: false,
                        id_user: userObj.id,
                        id_room: roomObj.id,
                        role: role
                    })
                    .then(() => res.sendStatus(200))
                    .catch((err) => res.status(503).send(err));
                }else{
                    if(joinData.banned){
                        res.sendStatus(401);
                    }
                }
                
            }).catch((err) => res.status(503).send(err))
        }).catch((err) => res.status(503).send(err));
        
    },
    banUser: async (req, res) => {
        const { uri, userUUID } = req.params;
        const owner = req.userInfo;
        const ownerObj = await db.User.findOne({ where: { uuid: owner.uuid }});
        
        db.Room.findOne({ where: { uri: uri }}).then((roomObj) => {
            if(roomObj.owner != ownerObj.id) return res.sendStatus(403);
            if(roomObj == null) return res.status(404).send("Room not found");

            db.User.findOne({ where: { uuid: userUUID }}).then((userObj) => {
                if(userObj == null){
                    return res.status(404).send("User not found");
                }

                db.UsersRoom.update({ banned: true }, {
                    where: {
                        id_user: userObj.id,
                        id_room: roomObj.id
                }})
                .then(() => res.sendStatus(200))
                .catch((err) => res.status(503).send(err));
            }).catch((err) => res.status(503).send(err))
        }).catch((err) => res.status(503).send(err));
    },
    get: (req,res) => {
        const { uri } = req.params;
        
        db.Room.findOne({ where: { uri: uri } }).then((result) => {
            if(result == null)
                res.sendStatus(404);
            else
                res.status(200).send(result);
        }).catch((err) => {
            res.status(503).send(err);
        })
    },
    create: (req,res) => {
        const { name, maxValue, includeUnknownCard, includeCoffeeCard } = req.body;
        const owner = req.userInfo;
        let uri = faker.random.alphaNumeric(8);

        db.User.findOne({ where: { uuid: owner.uuid } }).then(async (ownerObj) => {
            while(true){
                const uriRepeated = await db.Room.findOne({ where: { uri: uri }});
                if(uriRepeated != null)
                    uri = faker.random.alphaNumeric(8);
                else
                    break;
            }

            const roomUUID = uuidv4();

            db.Room.create({
                name: name,
                maxValue: maxValue,
                uuid: roomUUID,
                includeCoffeeCard: includeCoffeeCard,
                includeUnknownCard: includeUnknownCard,
                owner: ownerObj.id,
                uri: uri
            }).then(() => {
                res.status(200).send({ uri, uuid: roomUUID });
            }).catch((err) => {
                res.status(503).send(err); 
            })
        }).catch((err) => {
            res.status(503).send(err);
        });
    },
    update: async (req,res) => {
        const { uuid } = req.params;
        const { name, includeCoffeeCard, includeUnknownCard, maxValue } = req.body;
        const owner = req.userInfo;

        db.User.findOne({ where: { uuid: owner.uuid } }).then(async (ownerObj) => {
            db.Room.update({
                name: name,
                maxValue: maxValue,
                includeCoffeeCard: includeCoffeeCard,
                includeUnknownCard: includeUnknownCard,
            }, { where: { uuid: uuid, owner: ownerObj.id }}).then(([affectedCount]) => {
                if(affectedCount == 0)
                    res.sendStatus(401);
                else
                    res.sendStatus(200);
                
            }).catch((err) => {
                res.status(503).send(err);
            })
        });
    },
    delete: (req,res) => {
        const { uuid } = req.params;

        db.Room.destroy({ where: { uuid: uuid } }).then(() => {
            res.status(200);
        }).catch((err) => {
            res.status(503).send(err);
        })
    }
}

module.exports = RoomController;
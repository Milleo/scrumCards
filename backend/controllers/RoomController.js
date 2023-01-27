const db = require("../database/models");
const faker = require("faker");
const status = require("http-status");

const RoomController = {
    list: (req,res) => {
        db.Room.findAll().then((result) => {
            res.status(status.OK).send(result);
        });
    },
    join: (req, res) => {
        const { uri } = req.params;
        let { role } = req.body;
        const user = req.userInfo;
        
        db.Room.findOne({ where: { uri: uri }}).then((roomObj) => {
            if(roomObj == null){
                return res.status(status.NOT_FOUND).send("Room not found");
            }
            db.User.findOne({ where: { uuid: user.uuid }}).then(async (userObj) => {
                if(userObj == null){
                    return res.status(status.NOT_FOUND).send("Room not found");
                }
                if(userObj.uuid == user.uuid){
                    role = "owner";
                }

                const joinData = await db.UsersRooms.findOne({ where: { id_user: userObj.id, id_room: roomObj.id }});
                if(joinData == null){
                    db.UsersRooms.create({
                        banned: false,
                        id_user: userObj.id,
                        id_room: roomObj.id,
                        role: role
                    })
                    .then(() => res.status(status.OK).send({ role: role }))
                    .catch((err) => res.status(status.INTERNAL_SERVER_ERROR).send(err));
                }else{
                    if(joinData.banned)
                        return res.sendStatus(status.UNAUTHORIZED);

                    return res.status(200).send(joinData);
                }
                
            }).catch((err) => res.status(status.INTERNAL_SERVER_ERROR).send(err))
        }).catch((err) => res.status(status.INTERNAL_SERVER_ERROR).send(err));
        
    },
    banUser: async (req, res) => {
        const { uri, userUUID } = req.params;
        const owner = req.userInfo;
        const ownerObj = await db.User.findOne({ where: { uuid: owner.uuid }});
        
        db.Room.findOne({ where: { uri: uri }}).then((roomObj) => {
            if(roomObj.owner != ownerObj.id) return res.sendStatus(status.UNAUTHORIZED);
            if(roomObj == null) return res.status(status.NOT_FOUND).send("Room not found");

            db.User.findOne({ where: { uuid: userUUID }}).then((userObj) => {
                if(userObj == null){
                    return res.status(status.NOT_FOUND).send("User not found");
                }

                db.UsersRooms.update({ banned: true }, {
                    where: {
                        id_user: userObj.id,
                        id_room: roomObj.id
                }})
                .then(() => res.sendStatus(status.OK))
                .catch((err) => res.status(status.INTERNAL_SERVER_ERROR).send(err));
            }).catch((err) => res.status(status.INTERNAL_SERVER_ERROR).send(err))
        }).catch((err) => res.status(status.INTERNAL_SERVER_ERROR).send(err));
    },
    get: (req,res) => {
        const { uri } = req.params;
        
        db.Room.findOne({ where: { uri: uri } }).then((result) => {
            if(result == null)
                res.sendStatus(status.NOT_FOUND);
            else
                res.status(status.OK).send(result);
        }).catch((err) => {
            res.status(status.INTERNAL_SERVER_ERROR).send(err);
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

            db.Room.create({
                name: name,
                maxValue: maxValue,
                includeCoffeeCard: includeCoffeeCard,
                includeUnknownCard: includeUnknownCard,
                owner: ownerObj.id,
                uri: uri
            }).then((data) => {
                res.status(status.OK).send({ uri: data.uri, uuid: data.uuid });
            }).catch((err) => {
                res.status(status.INTERNAL_SERVER_ERROR).send(err); 
            })
        }).catch((err) => {
            res.status(status.INTERNAL_SERVER_ERROR).send(err);
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
                    res.sendStatus(status.UNAUTHORIZED);
                else
                    res.sendStatus(status.OK);
                
            }).catch((err) => {
                res.status(status.INTERNAL_SERVER_ERROR).send(err);
            })
        });
    },
    delete: (req,res) => {
        const { uuid } = req.params;

        db.Room.destroy({ where: { uuid: uuid } }).then(() => {
            res.status(status.OK);
        }).catch((err) => {
            res.status(status.INTERNAL_SERVER_ERROR).send(err);
        })
    }
}

module.exports = RoomController;
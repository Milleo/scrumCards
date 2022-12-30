const db = require("../database/models");
const { v4: uuidv4 } = require('uuid');
const faker = require("faker");

const RoomController = {
    list: (req,res) => {
        db.Room.findAll().then((result) => {
            res.send(200, result);
        });
    },
    join: (req, res) => {
        const { uri } = req.params;
        const { userUUID, role } = req.body;
        
        db.Room.findOne({ where: { uri: uri }}).then((roomObj) => {
            if(roomObj == null){
                return res.status(404).send("Room not found");
            }
            db.User.findOne({ where: { uuid: userUUID }}).then((userObj) => {
                if(userObj == null){
                    return res.status(404).send("Room not found");
                }

                db.UsersRoom.create({
                    banned: false,
                    id_user: userObj.id,
                    id_room: roomObj.id,
                    role: role
                })
                .then(() => res.send(200))
                .catch((err) => res.status(503).send(err));
            }).catch((err) => res.status(503).send(err))
        }).catch((err) => res.status(503).send(err));
        
    },
    get: (req,res) => {
        const { uri } = req.params;
        
        db.Room.findOne({ where: { uri: uri } }).then((result) => {
            if(result == null)
                res.send(404);
            else
                res.send(200, result);
        }).catch((err) => {
            res.send(503,err);
        })
    },
    create: (req,res) => {
        const { roomName, maxValue, includeUnknownCard, includeCoffeeCard, owner } = req.body;
        let uri = faker.random.alphaNumeric(8);

        db.User.findOne({ where: { uuid: owner } }).then(async (ownerObj) => {
            while(true){
                const uriRepeated = await db.Room.findOne({ where: { uri: uri }});
                if(uriRepeated != null)
                    uri = faker.random.alphaNumeric(8);
                else
                    break;
            }

            const roomUUID = uuidv4();
            db.Room.create({
                name: roomName,
                maxValue: maxValue,
                uuid: roomUUID,
                includeCoffeeCard: includeCoffeeCard,
                includeUnknownCard: includeUnknownCard,
                owner: ownerObj.id,
                uri: uri
            }).then(() => {
                res.send(200, { uri, uuid: roomUUID });
            }).catch((err) => {
                res.status(503).send(err); 
            })
        }).catch((err) => {
            res.status(503).send(err);
        });
    },
    update: (req,res) => {
        const { uuid } = req.params;
        const { roomName, includeCoffeeCard, includeUnknownCard } = req.body;

        db.Room.update({
            name: roomName,
            includeCoffeeCard: includeCoffeeCard,
            includeUnknownCard: includeUnknownCard,
        }, { where: { uuid: uuid }}).then(() => {
            res.send(200);
        }).catch((err) => {
            res.status(503).send(err);
        })
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
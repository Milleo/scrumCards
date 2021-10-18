const db = require("../database/models");
const { v4: uuidv4 } = require('uuid');
const faker = require("faker");

const RoomController = {
    list: (req,res) => {
        db.Room.findAll().then((result) => {
            res.send(200, result);
        });
    },
    get: (req,res) => {
        const { uri } = req.params;
        
        db.Room.findOne({ where: { uri: uri } }).then((result) => {
            if(result == null) res.send(404);
            res.send(200, result);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(503);
        })
    },
    create: async (req,res) => {
        const { roomName, maxValue, includeUnknownCard, includeCoffeeCard, owner } = req.body;

        let uri = faker.random.alphaNumeric(8);
        console.log(owner);
        db.User.findOne({ where: { name: owner } }).then(async (ownerObj) => {
            while(true){
                const uriRepeated = await db.Room.findOne({ where: { uri: uri }});
                if(uriRepeated != null)
                    uri = faker.random.alphaNumeric(8);
                else
                    break;
            }

            db.Room.create({
                name: roomName,
                maxValue: maxValue,
                uuid: uuidv4(),
                includeCoffeeCard: includeCoffeeCard,
                includeUnknownCard: includeUnknownCard,
                owner: ownerObj.id,
                uri: uri
            }).then(() => {
                console.log(uri);
                res.send(200, uri);
            }).catch((err) => {
                console.log(err);
                res.sendStatus(503);    
            })
        }).catch((err) => {
            console.log(err);
            res.sendStatus(503);
        });
    },
    update: (req,res) => {
        const { uuid } = req.params;
        const { roomName } = req.body;

        db.Room.update({ name: roomName }, { where: { uuid: uuid }}).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(503);
        })
    },
    delete: (req,res) => {
        const { uuid } = req.params;

        db.Room.destroy({ where: { uuid: uuid } }).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(503);
        })
    }
}

module.exports = RoomController;
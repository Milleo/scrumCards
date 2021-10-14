const RoomController = {
    list: (req,res) => {
        res.send("List Rooms");
    },
    show: (req,res) => {
        res.send("OK");
    },
    create: (req,res) => {
        res.send("CREATE");
    },
    update: (req,res) => {
        res.send("OK");
    },
    delete: (req,res) => {
        res.send("OK");
    }
}

module.exports = RoomController;
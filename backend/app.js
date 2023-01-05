var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var http = require('http');

var indexRouter = require('./routes/index');
var roomsRouter = require("./routes/RoomsRouter");
var usersRouter = require("./routes/UsersRouter");

var app = express();

/**
 * Normalize a port into a number, string, or false.
 */

 function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', (req, res) => {
  res.redirect(307, req.originalUrl.replace("/api", ""));
});
app.use('/', indexRouter);
app.use('/rooms', roomsRouter);
app.use('/users', usersRouter);


var port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

var server = http.createServer(app);
var { Server } = require("socket.io");
var io = new Server(server);
var userCount = 0;
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.join("AAAAAAAAAA");
    const roomCount = io.sockets.adapter.rooms.get("AAAAAAAAAA").size
    io.emit("welcome", roomCount);

    socket.on("TESTE", () => {
        console.log("TESTE FIRED");
        io.emit("TESTE", userCount++);
    })

    socket.on("disconnect", () => {
        io.emit("TESTE", userCount--);
    })
});

module.exports = { server, port, app };

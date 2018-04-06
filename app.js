var express= require("express");
var bodyParser= require("body-parser");
const mongoose = require('mongoose');
var app= express();
const  port = parseInt(process.env.PORT, 10) || 8080;
var db= require("./models/connection.js");
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cors = require('cors');

app.set('port', port);
const server = app.listen(app.get('port'), ()=>{
    console.log(' opened the gates on port ' + app.get('port'));
});
app.use(cors());
var io = require('socket.io')(server);
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(jsonParser);
app.use(urlencodedParser);
app.use(session({
  secret: 'ioolia',
  resave: false,
  saveUninitialized: false,
  rolling:true,
 cookie: { httpOnly: false  ,  maxAge: 600000},
  store: new MongoStore({
    mongooseConnection: db
  })
}));
app.use("/view", express.static(__dirname + '/view'));
app.use("/vvrview", express.static(__dirname + '/vrview'));

app.use("/origami", express.static(__dirname + '/origami'));
app.use("/uploads", express.static(__dirname + '/uploads'));
require('./routes')(app);
app.get('/vrview/index.html', (req, res) => {
    res.sendFile(__dirname + '/vrview/index.html');})

app.get('/vrview/index.html', (req, res) => {
    res.sendFile(__dirname + '/vrview/index.html');})
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/view/index.html');
console.log(req.session.username);
console.log(req.session.cookie);
});

io.on('connection', function(socket){
  console.log('a user connected '+ socket.id);

socket.on('addlike',  (data) => {
io.emit('addlike',data);
});
socket.on('adddislike',  (data) => {
io.emit('adddislike',data);
});
socket.on('addundislike',  (data) => {
io.emit('addundislike',data);
});
socket.on('addunlike', (data) =>{
console.log('server side o yeee '+ socket.id);
console.log(data);
 io.emit('addunlike',data);

});
})

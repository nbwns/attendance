let port = 8082;
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let cors = require('cors');
let mongoose = require('mongoose');
let multer  = require('multer')
let upload = multer({ dest: 'uploads/' })
let nonAttendance = require('./controllers/routes/nonAttendance.js');

mongoose.connect('mongodb://localhost:27017/attendancelist');

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'))


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: 'application/json'}));
app.use(cors());

app.get('/', (req, res) => res.json({message: "OK"}));

app.post('/nonattendance', upload.single('files'), nonAttendance.post);

app.listen(port);
console.log("Listening on port " + port);

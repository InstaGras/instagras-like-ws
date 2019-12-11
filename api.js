//GESTION DES VARIABLES D ENVIRONNEMENT

require('dotenv').config({path: __dirname + '/.env'})

//DB CONNECTION

const { Pool, Client } = require('pg');
const client = new Client({
  user: process.env['client.user'],
  host: process.env['client.host'],
  database: process.env['client.database'],
  password: process.env['client.password'],
  port: process.env['client.port'],
})
client.connect();

//API CONST

const express = require('express'); 
const hostname = process.env['app.hostname'];
const port = process.env['app.port'];  
const app = express(); 
const bodyParser = require("body-parser");
const myRouter = express.Router(); 
const cors = require('cors');
const routes = require('./routes');

//ROUTING

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

myRouter.route('/')
//permet de prendre en charge toutes les méthodes. 
.all(function(req,res){ 
      res.json({message : "Welcome to Instagras like web service", methode : req.method});
});

//POST
myRouter.route('/likesws/likes/')
.post(function(req, response){
  console.log('wsh')
	routes.likePublication(req, response, client);
});

// GET

myRouter.route('/likesws/likes/:id')
.get(function(req, response){
  console.log('1er get');
	routes.getAllLikesOfPublication(req, response, client);
});


myRouter.route('/likesws/likes/getLikeUser/:id/:username')
.get(function(req, response){
  console.log('2eme get');
	routes.getLikeOfOneUserForOnePublication(req, response, client);
});


// DELETE
myRouter.route('/likesws/likes/')
.delete(function(req, response){
  console.log(req.body);
	routes.undoLike(req,response,client);
})

//PREVENTING ATTACKS

 // Importing Dependencies
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Helmet
app.use(helmet());

// Rate Limiting
const limit = rateLimit({
    max: 100,// max requests
    windowMs: 60 * 60 * 1000, // 1 Hour of 'ban' / lockout 
    message: 'Too many requests' // message to send
});

// Body Parser
app.use(express.json({ limit: '10kb' })); // Body limit is 10

// Data Sanitization against NoSQL Injection Attacks
app.use(mongoSanitize());

// Data Sanitization against XSS attacks
app.use(xss());

 
// asking for the ap to use ratelimiting
app.use(myRouter,limit);  
 
// START API

app.listen(port, hostname, function(){
	console.log("Mon serveur fonctionne sur http://"+ hostname +":"+port); 
});



var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

var app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/conversationDB');

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});

/*******
 SCHEMA/MODELS
********/

var playerSchema = new mongoose.Schema({
  namefirst: String,
  namelast: String
});

var PlayerModel = mongoose.model( 'player', playerSchema );

var gameSchema = new mongoose.Schema({
  white: mongoose.Schema.Types.ObjectId,
  black: mongoose.Schema.Types.ObjectId,
  winner: String,
  date: Date,
  resign: Boolean,
  score: Number,
  handicap: Number,
  komi: Number
});
var GameModel = mongoose.model( 'game', gameSchema );


/*******
 ROUTES
********/

app.get('/api/', function( req, res ) {
  res.send("It's alive!");
});

app.get('/api/players', function( req, res ) {
  PlayerModel.find({}, function( error, items ) {
    if ( error ) {
      res.send(error);
    } else {
      res.json( { player:items } );
    }
  });
});
app.get('/api/players/:player_id', function( req, res ) {
  PlayerModel.findById( req.params.player_id, function( error, item ) {
    if ( error ) {
      res.send(error);
    } else {
      res.json( { player:item } );
    }
  });
});
app.post('/api/players', function( req, res ) {
  console.log('POST Player', req.body);
  
  // quick validation
  if (( req.body.player.namefirst === '' ) && ( req.body.player.namelast === '' )) {
    res.status(400).json( { errors:{
      global: ["Player must have a name."],
      namefirst: ["Player must have a name."],
      nameFirst: ["Player must have a name."],
    } } );
    return;
  }
  
  var newPlayer = new PlayerModel();
  newPlayer.namefirst = req.body.player.namefirst;
  newPlayer.namelast = req.body.player.namelast;
  console.log('New Player record:', newPlayer );
  
  newPlayer.save(function(error) {
    if (error) {
      res.send(error);
    } else {
      res.json({ player: newPlayer });
    }
  });
});
app.put('/api/players/:player_id', function( req, res ) {
  console.log('PUT Player', req.body);
  
  PlayerModel.findById( req.params.player_id, function( error, item ) {
    if ( error ) {
      res.send(error);
    } else {
      item.namefirst = req.body.namefirst;
      item.namelast = req.body.namelast;
      item.save(function(error) {
        if (error) {
          res.send(error);
        } else {
          res.json({ player: item });
        }
      });
    }
  });
});
app.delete('/api/players/:player_id', function( req, res ) {
  console.log('DELETE Player', req.body);
  
  PlayerModel.remove({
    _id: req.params.player_id },
    function( error, item ) {
      if ( error ) { res.send(error); }
      else { res.json( { message: 'success' } ); }
    });
    
  
});














app.get('/api/games', function( req, res ) {
  GameModel.find({}, function( error, items ) {
    if ( error ) {
      res.send(error);
    } else {
      res.json( { game:items } );
    }
  });  
});
app.post('/api/games', function( req, res ) {
  console.log('POST Game', req.body);
  
  
  var newGame = new GameModel();
  newGame.white = req.body.game.white;
  newGame.black = req.body.game.black;
  newGame.winner = req.body.game.winner;
  newGame.resign = req.body.game.resign;
  newGame.score = req.body.game.score;
  newGame.komi = req.body.game.komi;
  newGame.handicap = req.body.game.handicap;
  newGame.date = req.body.game.date;

  console.log('New Game record:', newGame );
  
  newGame.save(function(error) {
    if (error) {
      res.status(400).send( error );
    } else {
      res.json({ game: newGame });
    }
  });
});
app.get('/api/games/:game_id', function( req, res ) {
  GameModel.findById( req.params.game_id, function( error, item ) {
    if ( error ) {
      res.send(error);
    } else {
      res.json( { game:item } );
    }
  });
});
app.delete('/api/games/:game_id', function( req, res ) {
  console.log('DELETE Game', req.body);
  
  GameModel.remove({
    _id: req.params.game_id },
    function( error, item ) {
      if ( error ) { res.send(error); }
      else { res.json( { message: 'success' } ); }
    });
    
  
});















app.listen('4500');


/*
[{namelast:'Klein', namefirst:'Isaac'},
{namelast:'Tromp', namefirst:'Nya'},
{namelast:'Reilly', namefirst:'Rosalyn'},
{namelast:'Murray', namefirst:'Elisabeth'},
{namelast:'Kessler', namefirst:'Kelsi'},
{namelast:'Rogahn', namefirst:'Alta'},
{namelast:'Hermiston', namefirst:'Khalil'},
{namelast:'Emard', namefirst:'Alexander'},
{namelast:'Hahn', namefirst:'Ivah'},
{namelast:'Roberts', namefirst:'Carolanne'}]


*/
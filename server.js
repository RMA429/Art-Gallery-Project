// import the models
// node node_modules/sequelize-auto/bin/sequelize-auto -e sqlite -o "models/" -h "" -d "GameArtDB.sqlite"
const {Artist, Game, Artwork, Users } = require('./models');

const express = require('express');
const path = require('path');
const hbs = require( 'express-handlebars');


const session = require('express-session');

const fileupload = require('express-fileupload')

var bodyParser = require('body-parser');

var sequelize = require('sequelize');

const bcrypt = require('bcryptjs');

const fs = require('fs')
const AWS = require('aws-sdk')
	
// Enter copied or downloaded access ID and secret key here
// DO NOT PUSH THESE
const ID = ''
const SECRET = ''

// The name of the bucket that we're using
const BUCKET_NAME = 'notcoolbucket'

const s3 = new AWS.S3({
	accessKeyId: ID,
	secretAccessKey: SECRET
})


app = express();
app.set('port', 3002);




// setup handlebars and the view engine for res.render calls
// (more standard to use an extension like 'hbs' rather than
//  'html', but the Universiry server doesn't like other extensions)

app.set('view engine', 'html');
app.engine( 'html', hbs( {
  extname: 'html',
  defaultView: 'default',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

// set up session (in-memory storage by default)
app.use(session({secret: "This is a big long secret lama string."}));

// setup static file service
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static('./'));

function uploadFile(fileName){
	//read content from the file
	const fileContent = fs.readFileSync(fileName)

	//setting up S3 upload parameters
	const params = {
		Bucket: BUCKET_NAME,
		Key: fileName, // File name you want to save as in S3
		Body: fileContent
	}

	//uploading files to the bucket
	s3.upload(params, function(err, data) {
		if (err){
			throw err
		}
		console.log('File uploaded successfully. ${data.Location}')
	})

}



app.get('/uploadPage', (req, res) => {

	// If the user can be validated by session, then allow them into the upload page
	// Otherwise send them back to login_register with propogated errors.
	if(req.session.user){
		res.render('uploadPage');
	}
	else{
		res.redirect('/login_register');
	}

});

app.post('/uploaded', (req, res) => {
	var Artist_ID = 2
	var Game_ID = 2
	if(req.body.uploadStr){

		
		//Artist.findOne({
		//	where: {name: req.body.artistName}
		//}).then(artist =>{
		//	if (artist){
		//		Artist_ID = artist.id
		//	}
		//											//this block crashes 
		//	else{
		//		Artist.create({
		//			name: req.body.artistName,
		//		}).then(artist => {
		//			Artist_ID = artist.id
		//		});
		//	}
		//});

		


		
		Artwork.create({
			name: req.body.uploadName,
			image_url: req.body.uploadStr,
			artist_id: Artist_ID,
			game_id: Game_ID
			
		})
		
		//res.render('uploadPage')
	}


	//var fileName = 'arrow.PNG'
	//uploadFile(fileName) 
	//var newName = 'https://notcoolbucket.s3.amazonaws.com/' + fileName
	
	res.render('uploadPage');

})

app.get('/index', (req, res) => {
	if(req.session.user){
		res.render('index', {user: req.session.user});
	}
	else{
		res.render('index');
	}
});

app.get('/login_register', (req, res) => {
	if(req.session.user)
	{
		// There's no reason for the user to be in /login_register route
		res.redirect('/index');

	}
	else
	{
		res.render('login_register');
	}
});




//// Register/Login Cases.
//	login 1 : username and password match - redirect to home or profile page
//	login 2 : login username/password don't match. - render the same log/reg form w errors
//	register 1 : form values meet all the criteria so the user is added
//	register 2 : criteria aren't met. render log/reg form w errors
//
////
app.post('/login_register', (req,res) => {
	let errors =[];
	let username = req.body.username.trim(); // Req.body - Username | Should be in a form with Post method. input type Textbox with name username.
	let psswd = req.body.password.trim(); // Req.body - Password | Should be in a form with Post method. input type password with name password.
	//login_btn and regi_btn should be buttons in the HTML that will be named login_btn and regi_btn respectively.
	// when they are pressed, I'll check them using req.body._____  
	console.log(username);
	console.log(psswd);
	if(req.body.login_btn)
	{
		Users.findOne
		({
			where : {username: username}
		}).then(user => 
			{
			if(user){
				bcrypt.compare(psswd, user.password_hash, (err, match) => 
				{ 
					if(match)
					{
						req.session.user = user;
						res.redirect('/index');
					} else {
						errors.push({msg: "Password is incorrect."});
						res.render("login_register", {errors: errors, propogate: username});
					}
				});
		
			}
			else {
				errors.push({msg: "User does not exist."});
				res.render("login_register", {errors: errors, propogate: username});
			}
		}
		)
	}
	else if(req.body.register_btn)
	{
		if (username == ""){
			errors.push({msg: "Empty username."});
		}
		if (psswd.length < 4){
			errors.push({msg: "Password must be 4 characters or more."});
		}
		Users.findOne({
			where: {username: username}
		}).then(user =>{
			if (user){
				errors.push({msg: "Username is taken."});
			}
			if(errors.length > 0){
				res.render('login_register', {errors: errors, user: new Users({username: username})});
			}
			else{
				Users.create({
					username: username,
					password_hash : bcrypt.hashSync(psswd, 10),
					admin: 0
				}).then(user => {
					req.session.user = user;
					res.redirect('/index');
				});
			}
		});
	}
});






app.get('/profile', (req, res) => {      //probably gonna be profile:id
	if (req.session.user)
	{
		res.render('profile');   
	             }             //maybe should search based on id and display a profile based on that, like the item pages on the shopping cart
	else {
		res.redirect('/login_register');
	}
});

app.get('/search', (req, res) => {
	console.log("Ok. This is the 1st Get route");
	Artwork.findAll({}).then(works => {
		//console.log(works)
		res.render('search', {art: works});
	})
});

app.get('/search/query', (req, res) => {
	console.log("Ok. This is the 2nd Get route");
	console.log(req.query.terms);
	myString = req.query.terms;
		Artwork.findAll({
			where:{
				name: myString
			}
		}).then(works => {
			res.json(works);
		});
});

app.get('/results', (req, res) => {
	console.log(req.query.terms);
	var artistNames = []	
 	Artwork.findAll({
		where: {
			name: req.query.terms
		},
		include: [{
			model: Artist,
			as: Artist
		}]
	}).then(works => {
		works.forEach(function(element){
			//console.log(element);
			artistNames.push(element.dataValues.artist.dataValues.name);
		});
		res.render('results', {works: works, artist: artistNames});
	});
});

// view route to show a specific Item
app.get('/gallery/:id', function(req, res) {
	Artwork.findByPk(req.params.id, {
		include: [
			{model: Artist,
			as: Artist},
			{model: Game,
			as: Game}
		]
	}).then(art => {
		gameName = art.dataValues.game.dataValues.name
		gameID = art.dataValues.game.dataValues.id
		artistName = art.dataValues.artist.dataValues.name
		res.render("gallery", {art: art, artist: artistName, game: gameName, gameID: gameID});
	});
});

app.get('/gamepage/:id', function(req, res) {
	Game.findByPk(req.params.id, {
		}).then(game => {
			Artwork.findAll({
				where: {
					game_id: req.params.id
				}}).then(arts => {
					res.render("gamepage", {game: game, arts: arts});
			})
		})
	});


app.get('/logout', (req, res) => {
	delete req.session.user;
	res.redirect('/index');
});

var server = app.listen(app.get('port'), function() {
	console.log("Server started...")
});
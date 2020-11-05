var express = require('express')
var app = express()
var formidable = require("formidable")
var fs = require("fs")
var credentials = require("./models/credentials.js")
var mongoose = require("mongoose")
var rest = require("connect-rest")
var meadowlark_users = require("./meadowlark_users.js")
var Attraction = require("./models/attraction.js")

var Vacation = require("./models/vacation.js")
var opts = {
	server: {
		socketOptions: {keepAlive: 1},
		useUnifiedTopology: true,
		useNewUrlParser: true,
		
	}
}


 
app.set('port', process.env.port || 3000)

var handlebars = require("express3-handlebars").create({defaultLayout: "main"})
app.engine("handlebars", handlebars.engine)
app.set("view engine", "handlebars")

//app.use(express.static(__dirname + "/public"))

// app.use(function(req, res, next){
	// res.locals.flash = req.session.flash;
	// delete req.session.flash;
	// next();
// });

app.use(require("body-parser")());

var dataDir = __dirname + "/data";
var vacationPhotodir = dataDir + "/vacation-photo";
fs.existsSync(dataDir) || fs.mkdirSync(dataDir);
fs.existsSync(vacationPhotodir) || fs.mkdirSync(vacationPhotodir);

function saveContestEntry(contestName, email, year, month, photoPath){
	
}

app.get("/newsletter", function(req,res){
	res.render("newsletter", {csrf:"CSRF token goes here"})
})
// app.post("/newsletter", function(req, res){
	// var name = req.body.name || "", email = req.body.email || "";
	// if(!email.match(VALID_EMAIL_REGEX)){
		// if(req.xhr) return res.json({error: "Invalid name email address."});
		// req.session.flash = {
			// type: "danger",
			// intro: "validation error!",
			// message: "The email address you entered was not valid",
		// };
		// return res.redirect(303, "/")
	// }
	// new NewsletterSignup({ name: name, email: email }).save(function(err){
 // if(err) {
 // if(req.xhr) return res.json({ error: 'Database error.' });
 // req.session.flash = {
 // type: 'danger',
 // intro: 'Database error!',
 // message: 'There was a database error; please try again later.',
 // }
 // return res.redirect(303, '/newsletter/archive');
 // }
 // if(req.xhr) return res.json({ success: true });
 // req.session.flash = {
 // type: 'success',
 // intro: 'Thank you!',
 // message: 'You have now been signed up for the newsletter.',
 // };
 // return res.redirect(303, '/newsletter/archive');
 // });

// })

app.post("/process", function(req,res){
	console.log("Form (from querystring): " + req.query.form);
	console.log("CSRF token (from hidden form field): " + req.body._csrf);
	console.log("Name (from visible form field): " + req.body.name);
	console.log("got tired of typing: " + req.body.email);
	res.redirect(303, "/loginsuc");
	
})


usersconnectionstring = credentials.mongo.users.connectionString
mongoose.connect(usersconnectionstring)
app.post("/process-signup", function(req,res){
	
	meadowlark_users.find({email: req.body.email}, function(err, meadowlark_user){
		if (meadowlark_user.length){
			console.log("user already exists");
			return;
		}
		
		new meadowlark_users({
			email: req.body.email,
			password: req.body.password,
		}).save()
		console.log("Success!")
	})
	
})

app.post("/process-login", function(req, res){
	meadowlark_users.find({email: req.body.email}, function(err, meadowlark_user){
		
		if(meadowlark_user[0].password === req.body.password){
			console.log("login succcessful")
			res.redirect(303, "/about")
		}
		else{
			console.log("Incorrect Password!")
			return
		}
		
	})
	
})

app.get("/contest/vacation-photo", function(req, res){
	var now = new Date()
	res.render("contest/vacation-photo", {
		year: now.getFullYear(), month: now.getMonth()
	})
})
app.post("/contest/vacation-photo/:year/:month", function(req,res){
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files){
		if(err) return res.redirect(303, "/error");
		if(err){
			res.session.flash = {
				type: "danger",
				intro: "Oops!",
				message: "There was an error processing your submission. "+
				"please try again.",
			};
			return res.redirect(303, "/contest/vacation-photo");
		}
		var photo = files.photo;
		var dir = vacationPhotodir + "/" + Date.now();
		var path = dir + "/" + photo.name;
		fs.mkdirSync(dir)
		fs.renameSync(photo.path, dir + "/" + photo.name);
		saveContestEntry("vacation-photo", fields.email, req.params.year, req.params.month, path);
		
		
		console.log("received fields: ");
		console.log(fields);
		console.log("recieved files: ");
		console.log(files);
		res.redirect(303, "/loginsuc")
	})
})

app.use(function(req, res, next){
	res.locals.showTests = app.get("env") != 'production' && req.query.test === "1";
	next();
})

switch(app.get("env")){
	case "development":
		console.log(app.get("env") + " env")
		//mongoose.connect(credentials.mongo.development.connectionString, opts);
		break;
	case "production":
		console.log(app.get("env") + " env")
		mongoose.connect(credentials.mongo.development.connectionString, opts);
		break;
	default:
		throw new Error("Unknown execution environment: " + app.get("env"));
}

Vacation.find(function(err, vacations){
	if(vacations.length) return;
	
	new Vacation({
		name: 'Hood River Day Trip',
		slug: 'hood-river-day-trip',
		category: 'Day Trip',
		sku: 'HR199',
		description: 'Spend a day sailing on the Columbia and ' +
		'enjoying craft beers in Hood River!',
		priceInCents: 9995,
		tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
		inSeason: true,
		maximumGuests: 16,
		available: true,
		packagesSold: 0,
	}).save();
	
	new Vacation({
		name: 'Oregon Coast Getaway',
		slug: 'oregon-coast-getaway',
		category: 'Weekend Getaway',
		sku: 'OC39',
		description: 'Enjoy the ocean air and quaint coastal towns!',
		priceInCents: 269995,
		tags: ['weekend getaway', 'oregon coast', 'beachcombing'],
		inSeason: false,
		maximumGuests: 8,
		available: true,
		packagesSold: 0,
	}).save();
	
	new Vacation({
		name: 'Rock Climbing in Bend',
		slug: 'rock-climbing-in-bend',
		category: 'Adventure',
		sku: 'B99',
		description: 'Experience the thrill of climbing in the high desert.',
		priceInCents: 289995,
		tags: ['weekend getaway', 'bend', 'high desert', 'rock climbing'],
		inSeason: true,
		requiresWaiver: true,
		maximumGuests: 4,
		available: false,
		packagesSold: 0,
		notes: 'The tour guide is currently recovering from a skiing accident.',

	}).save();
	
	console.log("saved to database")
})

app.get("/vacations", function(req, res){
	Vacation.find({available: true}, function(err, vacations){
		var context = {
			vacations: vacations.map(function(vacation){
				return {
				sku: vacation.sku,
				name: vacation.name,
				description: vacation.description,
				price: vacation.getDisplayPrice(),
				inSeason: vacation.inSeason,
				}
			})
		}
		res.render("vacations", context);
	})
})

app.get('/', function(req, res){
	res.render("home")
	
});

var fortunes = ["Conquer your fears or they will conquer you.",
 "Rivers need springs.",
 "Do not fear what you don't know.",
 "You will have a pleasant surprise.",
 "Whenever possible, keep it simple.",
 "Netherite is nothing without Diamond",]
 console.log(fortunes[1])
 
app.get('/about', function(req, res){
	var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)]
	//console.log(randomFortune)
	res.render("about", {fortune: randomFortune})
	
});

app.get("/loginsuc", function(req,res){
	res.render("loginsuc")
	
})

Attraction.find(function(err, attraction){
	if (attraction.length) return;
	
	new Attraction({
		name: "My statue",
		description: "A statue of me",
		location: {
			lat: 1010231.11,
			lng: 1231342.33,
		},
		history: {},
		updateId: "131312312",
		approved: true,
	}).save()
})

var apiOptions = {
	context: "/api",
	domain: require("domain").create(),
}

//app.use(rest.rester(apiOptions))

app.get("/api/attractions", function(req, res){
	Attraction.find({approved: true}, function(err, attractions){
		if(err) return res.send(500, "Error occured: database error.")
		res.json(attractions.map(function(a){
			return {
				name: a.name,
				id: a._id,
				description: a.description,
				location: a.location,
			}
		}))
	})
})

app.get("/add-attractions", function(req, res){
	res.render("add-attractions")
})

app.post("/api/attraction", function(req, res){
	if(req.body.approved === "True" || req.body.approved == "true"){
		var approvedvar = true
	}
	else{
		approvedvar = false
	}
	Attraction.find({name: req.body.name}, function(err, attraction){
		if(err) return res.send(500, "Error occured: database error.");
		if(attraction.length){
			console.log("attraction already exits");
			
			return;
		}
	
	
	new Attraction({
		name: req.body.name,
		description: req.body.description,
		location:{lat: req.body.lat, lng: req.body.lng},
		history:{
			event: "created",
			email: req.body.email,
			date: new Date(),
		},
		approved: approvedvar,
	}).save(function(err, a){
		if(err) return res.send(500, "Error occured: database error.")
		res.json({id: a._id})
	})
	})
})

app.use(function(req, res){
	
	res.status(404)
	res.render('404')
})

app.use(function(err, req, res, next){
	console.error(err.stack)
	res.status(500)
	res.render("500")
})

app.listen(app.get('port'), function(){
	console.log("server running...")
	
})
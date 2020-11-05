let fs = require("fs")
let http = require("http")

http.createServer(function(req, res){
	let path = req.url.toLowerCase()
	
	switch(path){
		case "/":
			serveStaticFile(res, "/public/home.html", "text/html")
			break;
		case "/about":
			serveStaticFile(res, "/public/about.html", "text/html")
			break;
		default:
			serveStaticFile(res, "/public/404.html", "text/html", 404)
			break;
	}
}).listen(300)

var serveStaticFile = function(res, path, contentType, responseCode){
	if(!responseCode){
		responseCode = 200
	}
	fs.readFile(__dirname + path, function(err, data){
		if(err){
			res.writeHead(500, {"contentType": "text/plain"})
			res.end("500 - Internal Error")
		}
		else{
			res.writeHead(responseCode, {"contentType" : contentType})
			res.end(data)
		}
	})
}
console.log("server running..")















































// var fs = require("fs")
// var http = require("http")

// function serveStaticFile(res, path, contentType, responseCode){
	// if(!responseCode) responseCode = 200
	// fs.readFile(__dirname + path, function(err, data){
		// if(err){
			// res.writeHead(500, {'Content-Type': 'text/plain'})
			// res.end('500 - Internal Error')
		// }
		// else{
			// res.writeHead(responseCode, {'Content-Type': contentType})
			// res.end(data)
		// }
	// })
// }

// http.createServer(function(req, res){
	
	// var path = req.url.replace(/\/?(?:\?.*)?$/,"").toLowerCase()
	// switch(path){
		// case "":
			// serveStaticFile(res, '/public/home.html', 'text/html')
			// break;
		// case "/about":
			// serveStaticFile(res, "/public/about.html", "text/html")
			// break;
		// default:
			// serveStaticFile(res, "public/404.html", "text/html", 404)
			// break;
	// }
// }).listen(3000)

// console.log("server running...")


var express = require('express')
var app = express()
app.set("port", 3000)
app.get("/headers", function(req,res){
	res.set("content-Type", "text/plain");
	var s = "";
	console.log(res.headers)
	for(var name in req.headers){
		
		s+=name+":"+req.headers[name]+"\n";
		console.log(s)
		res.send(s)
		
	}
})
app.listen(app.get("port"), function(){
	console.log("server running")
	a = [1,2,3,4,5]
	for(var i in a){
		console.log(a[i])
	}
})
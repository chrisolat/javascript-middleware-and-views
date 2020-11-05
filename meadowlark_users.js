var mongoose = require("mongoose")
var checkusers = mongoose.Schema({
	email: String,
	password: String,
})
var CheckUsers = mongoose.model("CheckUsers", checkusers)
module.exports = CheckUsers;
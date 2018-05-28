const user = require("./userModel")
const service = require("./userService")
const api = require("./userAPI")

module.exports.user = user;
module.exports.service = service;
module.exports.api = api;

module.exports.genericuser= process.env.genericuser;
module.exports.genericpassword= process.env.genericpassword;
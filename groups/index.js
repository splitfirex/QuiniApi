const group = require("./groupModel").group;
const match = require("./groupModel").match;
const service = require("./groupService")
const api = require("./groupAPI")

module.exports.group = group;
module.exports.match = match;
module.exports.service = service;
module.exports.api = api;
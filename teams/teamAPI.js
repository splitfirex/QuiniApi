var express = require('express');
var router = express.Router();
var local = require("./");


router.get("/all", function (req, res, next) {
    local.service.findAllTeamsOrdered()
        .then((teams) => res.status(200).json(teams));
});

module.exports = router;
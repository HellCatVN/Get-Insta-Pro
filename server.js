var express = require('express');
var app = require("./app");
var bodyparser = require("body-parser");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

var server = app.listen(process.env.PORT || 3000, function() {
  console.log("HellCat your server is on port " + server.address().port);
});
require('dotenv').config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var otherRouter = require("./routes/other");

var app = express();
var serverPort = process.env.PORT || 5000;

app.set("port", serverPort);
app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/otherRouter", otherRouter);

app.listen(serverPort, () => {
  console.log(`Server is running on port: ${serverPort}`);  
});

module.exports = app;
module.exports = serverPort;
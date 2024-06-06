require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport");
const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.use(passport.initialize());
require("./app/auth/passport");

app.use(require("./app/auth/routes"));
app.use(require("./app/job/routes"));
app.use(require("./app/moderator/routes"));
app.use(require("./app/volEducation/routes"));
app.use(require("./app/chat/routes"));
app.use(require("./app/news/routes"));


app.listen(8000, () => {
  console.log("server is listening at http://localhost:" + 8000);
});

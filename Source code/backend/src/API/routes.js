const express = require("express");
const APIrouter = express.Router();
const { UserPreference } = require("./user.controller");

APIrouter.post("/rank", UserPreference);

module.exports = APIrouter;

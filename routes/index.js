
const fs = require('fs');
const express = require("express");
const router = express.Router();
const path = require('path');
const directoryPath = path.join(__dirname, '../routes');
const { readdirSync } = require("fs");
readdirSync(directoryPath).filter(item=>item.indexOf("index.js")!==0).map((item) => router.use("", require(`../routes/${item}`)));
module.exports=router;
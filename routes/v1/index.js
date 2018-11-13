let express = require('express');
let router = express.Router();

let chitchat = require('./chatbot');
router.use("/chatbot", chitchat);
module.exports = router;

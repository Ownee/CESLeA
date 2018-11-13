let express = require('express');
let router = express.Router();
let koreaChat = require("../../../chatbot/korean");
let englishChat = require("../../../chatbot/english");

let koreaSess = {};

let englishSess = {};

let questionSess = {};


router.get('/korea', function (req, res, next) {
    let sentence = req.query.sentence;
    koreaChat.chat(sentence, koreaSess)
        .then((result) => {
            if (result) {
                koreaSess = Object.assign({}, koreaSess, result.sess);
            }
            res.json(result);
        }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    })
});


router.post('/korea', function (req, res, next) {
    let sentence = req.body.sentence;
    console.log(sentence);
    koreaChat.chat(sentence, koreaSess)
        .then((result) => {
            if (result) {
                koreaSess = Object.assign({}, koreaSess, result.sess);
            }
            res.json(result);
        }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.post('/korea/question', function (req, res, next) {
    let sentence = req.body.sentence;
    koreaChat.question(sentence,koreaSess)
        .then((result) => {
            if (result) {
                koreaSess = Object.assign({}, koreaSess, result.sess);
            }
            res.json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        })
});


router.get('/english', function (req, res, next) {
    let sentence = req.query.sentence;
    englishChat.chat(sentence, englishSess)
        .then((result) => {
            englishSess = Object.assign({}, englishSess, result.sess);
            res.json(result);
        }).catch((err) => {
        console.log(err)
        res.status(500).json(err);
    })
});


router.get('/english/question', function (req, res, next) {
    let sentence = req.query.sentence;
    questionSess.quest = true;
    englishChat.chat(sentence, questionSess)
        .then((result) => {
            englishSess = Object.assign({}, englishSess, result.sess);
            res.json(result);
        }).catch((err) => {
        console.log(err)
        res.status(500).json(err);
    })
});


router.get('/english/check', function (req, res, next) {
    let sentence = req.query.sentence;
    englishChat.isTravel(sentence)
        .then((result) => {
            res.json(result);
        }).catch((err) => {
            console.log(err);
        res.status(500).json(err);
    })
});

router.get('/english/travel', function (req, res, next) {
    let sentence = req.query.sentence;
    englishChat.chat(sentence, englishSess)
        .then((result) => {
            englishSess = Object.assign({}, englishSess, result.sess);
            res.json(result);
        }).catch((err) => {
        res.status(500).json(err);
    })
});


router.get('/init/korea', function (req, res, next) {
    koreaSess = {};
    res.json({});
});

router.get('/init/english', function (req, res, next) {
    englishChat.initTravel()
        .then(() => {
            englishSess = {};
            res.json({});
        }).catch((err) => {
        res.status(500).json(err);
    })
});


module.exports = router;

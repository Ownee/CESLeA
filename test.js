/*
let readline = require('readline');
let rl = readline.createInterface(process.stdin, process.stdout);

let english = require("./chatbot/english");

let sess = {};

let run =()=>{
    rl.setPrompt('guess> ');
    rl.prompt();

    rl.on('line', function (line) {
        if (line === "end") rl.close();

        english.chat(line,sess).then((res)=>{
           sess = res.sess;
           console.log(res.sentence,res.sess,res.others);
            rl.prompt();
        }).catch((err)=>{
            console.log("err",err);
            rl.close();
        })

    }).on('close', function () {
        process.exit(0);
    });
};


run();*/

let axios = require("axios")

let getInfoFromWiki = (input)=>{
    return axios.get("http://localhost:5000/ceslea/travel/api/v1.0/wiki?question="+input)
        .then((res)=>{
            return res.data;
        })
};


getInfoFromWiki("거미")
.then((result)=>{
    console.log(result)
}).catch((err)=>{
    console.log(err)
})
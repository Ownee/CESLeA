let grpc_wrapper = require('grpc-simple-wrapper');

let generatorMalubaClient = grpc_wrapper.client.createClient("localhost",60001);
let generatorGagClient = grpc_wrapper.client.createClient("localhost",60010);
let generatorNewClient = grpc_wrapper.client.createClient("localhost",60005);
let generatorWClient = grpc_wrapper.client.createClient("localhost",60002);
let generatorSelfClient = grpc_wrapper.client.createClient("localhost", 60007);

let generatorMaluba = (sentence) => {
    return new Promise((resolve, reject) => {
        let request = {
            sentence:sentence
        };
        generatorMalubaClient.send(request,(err,res)=>{
            if(err){
                reject(err)
            }else{

                let response ={
                    result: res["output"]
                };
                resolve(response);
            }
        });
    })
};
let generatorGag = (sentence) => {
    return new Promise((resolve, reject) => {
        let request = {
            sentence:sentence
        };
        generatorGagClient.send(request,(err,res)=>{
            if(err){
                reject(err)
            }else{

                let response ={
                    result: res["output"]
                };
                resolve(response);
            }
        });
    })
};

let generatorNew = (sentence,emotion) => {
    return new Promise((resolve, reject) => {
        let request = {
            sentence:sentence,
            emotion:emotion
        };
        generatorNewClient.send(request,(err,res)=>{
            if(err){
                reject(err)
            }else{

                let response ={
                    result: res["output"]
                };
                resolve(response);
            }
        });
    })
};

let generatorW = (sentence) => {
    return new Promise((resolve, reject) => {
        let request = {
            sentence:sentence
        };
        generatorWClient.send(request,(err,res)=>{
            if(err){
                reject(err)
            }else{

                let response ={
                    result: res["output"]
                };
                resolve(response);
            }
        });
    })
};

let generatorSelf = (index, sentence) => {
    return new Promise((resolve, reject) => {
        let request = {
            index:index,
            sentence:sentence
        };
        generatorSelfClient.send(request,(err,res)=>{
            if(err){
                console.log("grpc error in generatorSelf");
                reject(err)
            }else{

                let response ={
                    result: res["output"]
                };
                resolve(response);
            }
        });
    })
};

module.exports = {
    generatorGag,
    generatorMaluba,
    generatorNew,
    generatorW,
    generatorSelf
};
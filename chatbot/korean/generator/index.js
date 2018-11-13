let grpc_wrapper = require('grpc-simple-wrapper');

let generatorGagClient = grpc_wrapper.client.createClient("localhost",40003);
let generatorChestClient = grpc_wrapper.client.createClient("localhost",40001);

let generatorChitChatClient = grpc_wrapper.client.createClient("localhost",40001);

let generatorDramaClient = grpc_wrapper.client.createClient("localhost",40006);


let generateGag = (sentence) => {
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
let generateChest = (sentence) => {
    return new Promise((resolve, reject) => {
        let request = {
            sentence:sentence
        };
        generatorChestClient.send(request,(err,res)=>{
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

let generatorChitChat = (sentence) => {
    return new Promise((resolve, reject) => {
        let request = {
            sentence:sentence
        };
        generatorChitChatClient.send(request,(err,res)=>{
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


let generatorDrama = (sentence) => {
    return new Promise((resolve, reject) => {
        let request = {
            sentence:sentence
        };
        generatorDramaClient.send(request,(err,res)=>{
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


module.exports = {
    generateGag,
    generateChest,
    generatorChitChat,
    generatorDrama,
};

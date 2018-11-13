let grpc_wrapper = require('grpc-simple-wrapper');

let classifierChestClient = grpc_wrapper.client.createClient("localhost",40002);
let classifierChestEmotionClient = grpc_wrapper.client.createClient("localhost",40004);
let classifierGagEmotionClient = grpc_wrapper.client.createClient("localhost",40005);


let classifierChest = (sentence) => {
    return new Promise((resolve, reject) => {
        let request = {
            sentence:sentence
        };
        classifierChestClient.send(request,(err,res)=>{
            if(err){
                reject(err)
            }else{
                let response ={
                    result: parseInt(res["output"])
                };
                resolve(response);
            }
        });
    })
};

let classifierChestEmotion = (sentence) => {
    return new Promise((resolve, reject) => {
        let request = {
            sentence:sentence
        };
        classifierChestEmotionClient.send(request,(err,res)=>{
            if(err){
                reject(err)
            }else{

                let response ={
                    result: parseInt(res["output"])
                };
                resolve(response);
            }
        });
    })
};

let classifierGagEmotion = (sentence) => {
    return new Promise((resolve, reject) => {
        let request = {
            sentence:sentence
        };
        classifierGagEmotionClient.send(request,(err,res)=>{
            if(err){
                reject(err)
            }else{

                let response ={
                    result: parseInt(res["output"])
                };
                resolve(response);
            }
        });
    })
};



module.exports = {
    classifierGagEmotion,
    classifierChestEmotion,
    classifierChest
};

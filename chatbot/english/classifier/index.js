let grpc_wrapper = require('grpc-simple-wrapper');

let classifierAClient = grpc_wrapper.client.createClient("localhost",50051);
let classifierBClient = grpc_wrapper.client.createClient("localhost",50052);
let classifierCClient = grpc_wrapper.client.createClient("localhost",50053);
let classifierQAClient = grpc_wrapper.client.createClient("localhost",50054);
let classifierContextClient = grpc_wrapper.client.createClient("localhost",50055);


let classifierA = (sentence) => {
    return new Promise((resolve, reject) => {
        let request = {
            sentence:sentence
        };
        classifierAClient.send(request,(err,res)=>{
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

let classifierB = (sentence) => {
    return new Promise((resolve, reject) => {
        let request = {
            sentence:sentence
        };
        classifierBClient.send(request,(err,res)=>{
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

let classifierC = (sentence) => {
    return new Promise((resolve, reject) => {
        let request = {
            sentence:sentence
        };
        classifierCClient.send(request,(err,res)=>{
            if(err){
                reject(err)
            }else{
                // if(parseInt(res["output"]) === 0){
                //     let response ={
                //         result:5
                //     };
                //     resolve(response);
                // }else{
                    let response ={
                        result:parseInt(res["output"])
                    };
                    resolve(response);
                // }
            }
        });
    })
};


let classifierQA = (sentence) => {
    return new Promise((resolve, reject) => {
        let request = {
            sentence:sentence
        };
        classifierQAClient.send(request,(err,res)=>{
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

let classifierContext = (sentence) => {
    return new Promise((resolve, reject) => {
        let request = {
            sentence:sentence
        };
        classifierContextClient.send(request,(err,res)=>{
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
    classifierA,
    classifierB,
    classifierC,
    classifierQA,
    classifierContext
};

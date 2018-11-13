let grpcWrapper = require("./src");


let main = ()=>{

    let client = grpcWrapper.client.createClient("localhost",50051);
    let input = {
        a:"aaa",
        b:3
    };

    client.send(input,(err,result)=>{
        if(err){
            console.log(err);
        }else{
            console.log("result : ", result)
        }
    })
};

main();

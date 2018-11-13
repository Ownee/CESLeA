let grpcWrapper = require("./src");


class Model extends grpcWrapper.server.BaseModel{
    send(data,callback){
        callback(null,{success:true})
    }
}


let main = ()=>{

    let model = new Model();

    let server = grpcWrapper.createServer(model,"localhost",66666);
    server.start();

};

main();

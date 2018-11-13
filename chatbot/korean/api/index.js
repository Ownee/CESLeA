let axios = require('axios')


let getFromNaver = (input) => {

    return axios({
        method:"post",
        url:"http://localhost:5002/ceslea/naverknowledge/api/v1.0/naver",
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        data:{
            question: input
        }
    }).then((res) => {
        return res.data;
    })
};


let getInfoFromWiki = (input)=>{
    return axios.get("http://localhost:5000/ceslea/travel/api/v1.0/wiki?question="+input)
        .then((res)=>{
            return res.data;
        })
};

module.exports = {
    getFromNaver,
    getInfoFromWiki
};
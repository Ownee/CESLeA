let axios = require('axios')

let getFlightInfo = (des,date,cabin)=>{
    return axios.get('http://localhost:5000/ceslea/travel/api/v1.0/flight?trip=oneway&destination='+des+'&departuredate='+date+'&cabinclass='+cabin)
        .then((res)=>{
            return res.data;
        })
};

let getHotelInfo = (des,checkin,checkout,rooms,persons)=>{
    return axios.get('http://localhost:5000/ceslea/travel/api/v1.0/hotel?destination='+des+'&checkin='+checkin+'&checkout='+checkout+'&rooms='+rooms+'&persons='+persons)
        .then((res)=>{
            return res.data;
        })
};

let getInfoFromWiki = (input)=>{
    return axios.get("http://localhost:5000/ceslea/travel/api/v1.0/wiki?question="+input)
        .then((res)=>{
            return res.data;
        })
};

let getWeather = ()=>{
    return axios.get('http://api.openweathermap.org/data/2.5/weather?q=Daegu&appid=cdb1a2b4a85f80f488959231750fa14c')
        .then((res)=>{
            return res.data;
        })
};


module.exports = {
    getFlightInfo,
    getHotelInfo,
    getWeather,
    getInfoFromWiki
};
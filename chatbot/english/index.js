let classifier = require("./classifier");
let generator = require("./generator");
let api = require("./api");
let axios = require("axios");

const STATE = {
    CHITCHAT: 0,
    GAG: 1,
    TRAVEL: 2,
    SELFINTRO: 3
};

const API_ENV = {
    ONLINE: 0,
    OFFLINE: 1
};

const apiEnv = API_ENV.OFFLINE;

let makeResponse = (sess,sentence, others) => {
    if (others) {
        return {
            sess:sess,
            sentence: sentence,
            others: others
        }
    } else {
        return {
            sess:sess,
            sentence: sentence,
        }
    }
};


let prev_state = []

let initTravel = ()=>{
    prev_state = []
    return generator.generatorW("xxx");
};




let isTravel = (_sentence)=>{
    let sentence = _sentence.toLowerCase();
    return classifier.classifierA(sentence)
        .then((res)=>{
            prev_state.unshift(res.result)
            if(prev_state.length>6){
                prev_state.splice(6)
            }
            console.log(prev_state)

            let travel_sentence_list = prev_state.filter((item)=>{
                return item==1
            });

            if(travel_sentence_list.length>1){
                prev_state.splice(0)
               return {
                   is_travel:true
               }
            }else{
                return {
                    is_travel:false
                }
            }
        })
}


let chat = (_sentence, sess = {}) => {
    let sentence = _sentence.toLowerCase();


    if(sentence.includes("find")){
        return api.getInfoFromWiki(sentence.replace("find",""))
            .then((result)=>{
                console.log(result);
                let output_sentence = "";
                return makeResponse(sess,result.description,result)
            })

    }else if(sentence.includes("weather")){
        return api.getWeather()
            .then(function (res) {
                if(res.weather&&res.weather[0]){
                    let output_sentence = "I'm in Daegu, Here is "+res.weather[0].main;
                    return makeResponse(sess,output_sentence)
                }else{
                    let output_sentence = "I can't receive weather information from another server.";
                    return makeResponse(sess,output_sentence)
                }
            })
            .catch(function (error) {
                let output_sentence = "I can't receive weather information from another server.";
                return makeResponse(sess,output_sentence)
            });
    }else if (sess.state === STATE.TRAVEL) {
        if(sentence.includes("finish")){
            return initTravel().then(()=>{
                sess.state = STATE.CHITCHAT;
                return makeResponse(sess,"Okay, let's talk about this later");
            })
        }else{
            return generator.generatorW(sentence).then((res) => {
                let result_sentence = res.result + "";
                if (result_sentence.charAt(0) !== "{") {
                    return makeResponse(sess,res.result)
                } else {
                    let json = mapperForHotelFlight(JSON.parse(result_sentence));
                    if (json.hotel && json.flight) {
                        return makeFlightHotelInfo(json.hotel,json.flight).then((res)=>{
                            sess.state = STATE.CHITCHAT;
                            return makeResponse(sess,res.sentence,res.data)
                        })

                    } else if (json.hotel) {
                        return makeHotelInfo(json.hotel).then((res)=>{
                            sess.state = STATE.CHITCHAT;
                            return makeResponse(sess,res.sentence,res.data)
                        })
                    } else {
                        return makeFlightInfo(json.flight).then((res)=>{
                            return makeResponse(sess,res.sentence,res.data)
                        })
                    }
                }
            })
        }
    } else if (sess.state === STATE.GAG) {
        if(sentence.includes("feel better") || sentence.includes("thank you") ||sentence.includes("thanks") ||sentence.includes("finish")){
            sess.state = STATE.CHITCHAT;
            return makeResponse(sess,"Tell me again if you want to laugh.");
        }else{
            return generator.generatorGag(sentence).then((res) => {
                return makeResponse(sess,res.result)
            });
        }
    } else if (sess.state === STATE.CHITCHAT) {
        sess.state = STATE.CHITCHAT;

        //gag로 빠지는거 추가

        return classifier.classifierA(sentence)
            .then(res=>{
                if(res.result===0){
                    return classifier.classifierC(sentence)
                        .then(res=>{
                            return generator.generatorNew(sentence,res.result).then((res)=>{
                                return makeResponse(sess,res.result)
                            })
                        })
                }else{
                    return classifier.classifierB(sentence)
                        .then(res=>{
                            if(res.result===0){
                                return generator.generatorMaluba(sentence).then((res)=>{
                                    return makeResponse(sess,res.result)
                                })
                            }else{
                                sess.state = STATE.TRAVEL;
                                return initTravel().then(()=>{
                                    return generator.generatorW(sentence).then((res)=>{
                                        return makeResponse(sess,res.result)
                                    })
                                })
                            }
                        })
                }
            })

    } else {
        sess.state = STATE.SELFINTRO
        console.log(sess);
        console.log(typeof sess.line_num)
        if (sess.quest) {
            return generator.generatorSelf("1", sentence, sess.line_num).then((res) => {
                if (res.result.includes("Thank you for using it")) {
                    sess.state = STATE.CHITCHAT
                }
                sess.line_num = res.line_num;
                return makeResponse(sess, res.result)
            })
        } else {
            return generator.generatorSelf("0", sentence, sess.line_num).then((res) => {
                if (res.result.includes("Thank you for using it")) {
                    sess.state = STATE.CHITCHAT
                }
                sess.line_num = res.line_num;
                return makeResponse(sess, res.result)
            })
        }
    }

};


let mapperForHotelFlight = (obj) => {
    let response = {
        hotel: null,
        flight: null
    };
    if (obj.hotel) {
        response.hotel ={};
        response.hotel.dest = obj.hotel.Destination;
        response.hotel.checkIn = obj.hotel.Check_in;
        response.hotel.checkOut = obj.hotel.Check_out;
        response.hotel.room = obj.hotel.Number_r;
        response.hotel.people = obj.hotel.Number_p;
    }
    
    if (obj.flight) {
        response.flight = {};
        response.flight.dest = obj.flight.Destination;
        response.flight.date = obj.flight.Date;
        response.flight.cabin = obj.flight.Cabin;
    }
    
    return response;
};

let makeFlightHotelInfo = (hotel, flight) => {
    return axios.all([
        api.getHotelInfo(hotel.dest, hotel.checkIn, hotel.checkOut, hotel.room, hotel.people),
        api.getFlightInfo(flight.dest, flight.date, flight.cabin)
    ]).then(axios.spread((hotelResult, flightResult) => {
        if (apiEnv === API_ENV.OFFLINE) {
            let new_data_hotel = {
                Hotels: hotelResult.Hotels.map((item) => {
                    return {Deal: item.Deal}
                })
            };
            let new_data_flight = flightResult

            let r_string = new_data_hotel.Hotels.map(item => item.Deal).join(',')
            let r1_string = new_data_flight.Flights.map(item => item.Flight).join(',')

            let output_sentence = 'hotel result ' + r_string + " modified flight result " + r1_string;
            output_sentence = output_sentence.slice(0, 100);
            let data = {
                view:"hotel_flight",
                hotel: new_data_hotel,
                flight: new_data_flight
            };

            return {sentence:output_sentence,data:data}
        } else {
            let r_string = hotelResult.Hotels.map(item => item.Deal).join(',');
            let r1_string = flightResult.Flights.map(item => item.Flight).join(',');
            let output_sentence =  'hotel result ' + r_string + " modified flight result " + r1_string;
            output_sentence = output_sentence.slice(0, 100);
            let new_data_hotel = hotelResult;
            let new_data_flight = {
                Flights: flightResult.Flights.map((item) => {
                    return {Flight: item}
                })
            };

            let data = {
                view:"hotel_flight",
                hotel: new_data_hotel,
                flight: new_data_flight
            };
            return {sentence:output_sentence,data:data}
        }
    }))
};

let makeFlightInfo = (flight) => {
    return api.getFlightInfo(flight.dest, flight.date, flight.cabin)
        .then(flightResult=>{
            if (apiEnv === API_ENV.OFFLINE) {
                let new_data_flight = flightResult

                let r1_string = new_data_flight.Flights.map(item => item.Flight).join(',');
                let output_sentence = "flight result " + r1_string;
                output_sentence = output_sentence.slice(0, 100);
                let data = {
                    view:"flight",
                    flight: new_data_flight
                };

                return {sentence:output_sentence,data:data}
            } else {
                let r1_string = flightResult.Flights.map(item => item.Flight).join(',');
                let output_sentence =  "flight result " + r1_string;
                output_sentence = output_sentence.slice(0, 100);
                let new_data_flight = {
                    Flights: flightResult.Flights.map((item) => {
                        return {Flight: item}
                    })
                };
                let data = {
                    view:"flight",
                    flight: new_data_flight
                };
                return {sentence:output_sentence,data:data}
            }
        })

};

let makeHotelInfo = (hotel) => {
    return api.getHotelInfo(hotel.dest, hotel.checkIn, hotel.checkOut, hotel.room, hotel.people)
        .then(hotelResult=>{
            if (apiEnv === API_ENV.OFFLINE) {
                let new_data_hotel = {
                    Hotels: hotelResult.Hotels.map((item) => {
                        return {Deal: item.Deal}
                    })
                };

                let r_string = new_data_hotel.Hotels.map(item => item.Deal).join(',')

                let output_sentence = 'hotel result ' + r_string;
                output_sentence = output_sentence.slice(0, 100);
                let data = {
                    view:"hotel",
                    hotel: new_data_hotel,
                };

                return {sentence:output_sentence,data:data}
            } else {
                let r_string = hotelResult.Hotels.map(item => item.Deal).join(',');
                let output_sentence =  'hotel result ' + r_string;
                output_sentence = output_sentence.slice(0, 100);
                let new_data_hotel = hotelResult;
                let data = {
                    view:"hotel",
                    hotel: new_data_hotel,
                };
                return {sentence:output_sentence,data:data}
            }
        })

};


module.exports = {
    chat,
    initTravel,
    isTravel
}
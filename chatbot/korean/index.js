let classifier = require("./classifier")
let generator = require("./generator")
let api = require("./api")

const STATE = {
    CHITCHAT: 0,
    GAG: 1,
    CHEST: 2
};


let makeResponse = (sess, sentence, others) => {
    if (others) {
        return {
            sess: sess,
            sentence: sentence,
            others: others
        }
    } else {
        return {
            sess: sess,
            sentence: sentence,
        }
    }
};


let prev_sentence = null;


let chat = (_sentence, sess = {}) => {
    let sentence = _sentence;
    prev_sentence = sentence;

    if (sess.state === STATE.CHEST) {
        if (sentence.includes("그만") || sentence.includes("고마워")) {
            sess.state = STATE.CHITCHAT;
            sess.chestInputs = [];
            return makePromise("또 아프면 얘기해!").then((res) => {
                return makeResponse(sess, res.result)
            })
        } else {
            if (Array.isArray(sess.chestInputs)) {
                sess.chestInputs.push(sentence)
            } else {
                sess.chestInputs = [sentence];
            }
            return Promise.all([
                generator.generateChest(sentence), classifier.classifierChestEmotion(sentence)
            ]).then((data) => {
                let output_sentence = data[0].result;
                let output_emotion = data[1].result;

                if (output_sentence === "진단을 시작하겠습니다.") {
                    return classifier.classifierChest(sess.chestInputs.join(' '))
                        .then((res) => {
                            let emotion = 0;
                            if (res.result === "심근경색이 발생할 가능성이 높습니다. 즉시 내원 바랍니다.") {
                                emotion = 4;
                            }
                            sess.chestInputs = [];
                            return makeResponse(sess, res.result, {emotion: emotion});
                        })
                } else {
                    return makeResponse(sess, output_sentence, {emotion: output_emotion});
                }
            });
        }

    } else if (sess.state === STATE.GAG) {
        if (sentence.includes("괜찮") || sentence.includes("고마워") || sentence.includes("그만")) {
            sess.state = STATE.CHITCHAT;
            return makePromise("심심하면 언제든지 말해!").then((res) => {
                return makeResponse(sess, res.result)
            })

        } else {
            console.log("gag")
            return generator.generateGag(sentence)
                .then((res) => {
                    console.log(res)
                    return classifier.classifierGagEmotion(res.result)
                        .then((res1) => {
                            return makeResponse(sess, res.result, {emotion: res1.result});
                        })
                }).catch((err) => {
                    console.log(err);
                    return makeResponse(sess, "다시 시도해주세요");
                });
        }
    } else {
        //찾아줘 뭐야 나오면 네이버 결과로 알려주기
        if(sentence.includes("찾아줘")||sentence.includes("찾아 줘")){
            return makeNaverInfo(sentence.replace("찾아줘","").replace("찾아 줘",""))
                .then((result)=>{
                    console.log(result)
                    return makeResponse(sess,result.description,result)
                })
        } else if (sentence.includes("심심해") || sentence.includes("지루해")) {
            sess.state = STATE.GAG;
            return makePromise("내가 웃게 해줄까? 아무말이나 해봐").then((res) => {
                return makeResponse(sess, res.result);
            })
        } else if (sentence.includes("아파") || sentence.includes("통증")) {
            sess.state = STATE.CHEST;
            return generator.generateChest("세실리아").then((res) => {
                return makeResponse(sess, res.result);
            })
        } else {
            console.log("test")
            return generator.generatorDrama(sentence).then((res) => {
                return makeResponse(sess, res.result);
            })
        }


    }


};

let makeNaverInfo = (sentence) => {
    return api.getFromNaver(sentence)
}


let question = (sentence, sess) => {
    return makeNaverInfo(sentence)
        .then((result) => {
            return makeResponse(sess, result.description, result)
        })
}


let makePromise = (sentence) => {
    return new Promise((resolve, reject) => {
        if (sentence) {
            resolve({result: sentence})
        } else {
            reject(new Error())
        }
    })
};

module.exports = {
    chat,
    question
}
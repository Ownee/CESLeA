let protobufToDict = (obj) => {
    let result = {};
    Object.keys(obj).forEach((key)=> {
        let item = getDict(obj[key]);
        if(item!==null){
            result[key] = item;
        }
    });
    return result;
};

let getDict = (value) => {
    switch (value.type) {
        case 2:
            return value["int_val"];
        case 3:
            return value["int64_val"];
        case 4:
            return value["float_val"];
        case 5:
            return value["double_val"];
        case 6:
            return value["string_val"];
        case 7:
            return value["bool_val"];
        case 8:
            return value["byte_val"];
        case 9:
            return value["uint32_val"];
        case 10:
            return value["uint64_val"];
        default:
            return null;

    }
};

let dictToProtobuf = (dict) => {
    let result = {};
    Object.keys(dict).forEach((key)=> {
        let value = getProto(dict[key]);
        if (value !== null) {
            result[key] = value;
        }
    });

    return result;
};

let getProto = (value) => {
    if (typeof value === "number") {
        return {type: 5, double_val: value}
    } else if (typeof value === "string") {
        return {type: 6, string_val: value}
    } else if (typeof value === "boolean") {
        return {type: 7, bool_val: value}
    } else if (value instanceof Buffer) {
        return {type: 8, byte_val: value}
    } else {
        return null;
    }
}

module.exports =  {
    dictToProtobuf,
    protobufToDict
}
const mongoose = require("mongoose");

const uuid = require("uuid");

const apiKeySchema = new mongoose.Schema({
    user: String,
    apikey: String
});

apiKeySchema.pre("save",function(next){
    const user = this;
    user.apikey = uuid.v4() ;
    next();
});

const ApiKey = mongoose.model("ApiKey", apiKeySchema);

module.exports = ApiKey; 
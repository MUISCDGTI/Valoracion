const dbConnect = require("./db.js");
const ApiKey = require("./apikeys.js");

dbConnect().then(
    () => {
        const user = new ApiKey({user: "fis"});
        user.save(function(err, user) {
            if (err) {
                console.log(err);
            }else{
                console.log("user: " + user.user + ", " + user.apikey + " saved.");
            }
        })
    }
)
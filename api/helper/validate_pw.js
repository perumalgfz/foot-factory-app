var bcrypt = require("bcrypt")

function validate(password, hash, callback){
    bcrypt.compare(password, hash, function(err, res) {
        if (err){
            console.log(err)
            return callback(err, false)
        }
        return callback(null,res)
    });
}

module.exports = validate;
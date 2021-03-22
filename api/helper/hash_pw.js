var bcrypt = require("bcrypt")

function hash(password,callback){
    bcrypt.genSalt(10,(err,salt)=> 
        bcrypt.hash(password,salt,
            (err,hash)=> {
                if(err){
                    callback(err,null)
                    return
                }
                //save pass to hash
                password = hash;
                callback(null,hash)
            })
    );
}

module.exports = hash 
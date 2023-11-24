// controllers/user-ctrls.js
const User = require('../models/user-model')
const Message = require('../models/message-model');

const createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        let result = await user.save();
        result = result.toObject();
        if (result) {
            delete result.password;
            res.send(req.body);
            console.log(result);
        } else {
            console.log("User already register");
        }
 
    } catch (e) {
        res.send("Something Went Wrong");
    }
}

module.exports = {
    createUser
}
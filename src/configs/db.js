const mongoose = require("mongoose");

module.exports = ()=>{
    return mongoose.connect("mongodb+srv://chatapp:praveen123@cluster0.9p9cjvm.mongodb.net/")
}
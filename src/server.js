const app = require("./index");
const connect = require("./configs/db")
app.listen(5000,async()=>{
    try{
        await connect()
        console.log("server is running port on 5000")
    }catch(err){
            console.log(err)
    }
    
})
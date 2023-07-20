const express = require("express");
const User = require("../models/user.model");
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.get("/",async(req,res)=>{
        try{
                const users = await User.find().lean().exec();
                return res.status(200).send({users:users});

        }catch(err){
                return res.status(500).send({message:"something went wrong....."})
        }
})


router.post("/",body("firstName").trim().not().isEmpty().withMessage("firstName is not empty").isLength({min:4}).withMessage("firsName is not less than 4 character"),body("email").isEmail(),async(req,res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
            const user = await User.create(req.body);
            return res.status(200).send({user:user});

    }catch(err){
            return res.status(500).send({message:"something went wrong....."})
    }
})

module.exports = router;
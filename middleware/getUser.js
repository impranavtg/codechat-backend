const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");
const mysign=process.env.MYSIGN;
const user = require("../models/Users");

const getuser=asyncHandler(async(req,res,next)=>{
    const token=req.header('authToken');
    if(!token){
        res.status(401).json({"Status":"Invalid Token! Please try again"})
    }
    try{
    const data= jwt.verify(token,mysign);
    req.user=await user.findById(data.user.id).select("-password");
    // console.log(req.user);
    next();
    }catch(error){
        console.error(error.message)
        res.status(401).json({"Status":"Invalid Token! Please try again"});
    }
});

module.exports=getuser;
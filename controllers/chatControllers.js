const asyncHandler=require("express-async-handler");
const Chat = require("../models/Chats");
const user = require("../models/Users");

const accessChats=asyncHandler(async (req,res)=>{
    const {userId}=req.body;
    if(!userId){
        console.log("Not received userId");
        return res.sendStatus(400);
    }
    var isChat=await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}}
        ]
    }).populate("users","-password").populate("latestMessage");
    isChat=await user.populate(isChat,{
        path:'latestMessage.sender',
        select:"name dp email"
    });
    if(isChat.length>0){
        res.send(isChat[0]);
    }
    else{
        var chatData={
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id,userId]
        }
         try{
            const createdChat=await Chat.create(chatData);
            const fullChat=await Chat.findOne({_id:createdChat._id}).populate("users","-password");
            res.status(200).send(fullChat);
         }
         catch(e){
            res.status(400);
            // Console.log("aji haa")
            throw new Error(e.message);
         }
    }
});

const getChats=asyncHandler(async (req,res)=>{
    try {
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}}).populate("users","-password").populate("groupAdmin","-password").populate("latestMessage").sort({updatedAt:-1}).then(async (result)=>{
            result=await user.populate(result,{
            path:'latestMessage.sender',
            select:"name dp email"
    });
    res.status(200).send(result);
        })
    } catch (error) {
        res.status(400);
        // Console.log("aji haa")
        throw new Error(e.message);
    }
});

const createGroupChat=asyncHandler(async (req,res)=>{
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message:"Please Fill all the fields!"})
    }
    var users=JSON.parse(req.body.users);
    if(users.length<2){return res.status(400).send({message:"Minimum two users are required to form a group chat!"})}
    users.push(req.user);
    try {
        const groupChat=await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user
        });
        const fullGroupChat=await Chat.findOne({_id:groupChat._id}).populate("users","-password").populate("groupAdmin","-password");
        res.status(200).json(fullGroupChat);

    } catch (error) {
        res.status(400);
        // Console.log("aji haa")
        throw new Error(e.message);
    }

});

const renameGroupChat=asyncHandler(async (req,res)=>{
    const {chatId,chatName}=req.body;
    const updatedChat=await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName
        },
        {
            new:true
        }
    ).populate("users","-password").populate("groupAdmin","-password");

    if(!updatedChat){
        res.status(404);
        throw new Error("Chat Not Found!");
    }
    else res.json(updatedChat);

});

const addToGroupChat=asyncHandler(async (req,res)=>{
    const {chatId,userId}=req.body;
    const addedUser= await Chat.findByIdAndUpdate(chatId,{
        $push:{users:userId},
    },
        {new:true}
    ).populate("users","-password").populate("groupAdmin","-password");
     if(!addedUser){
        res.status(404);
        throw new Error("Chat Not Found!");
    }
    else res.json(addedUser);
    });

const removeFromGroupChat=asyncHandler(async (req,res)=>{
    const {chatId,userId}=req.body;
    const removedUser= await Chat.findByIdAndUpdate(chatId,{
        $pull:{users:userId},
    },
        {new:true}
    ).populate("users","-password").populate("groupAdmin","-password");
     if(!removedUser){
        res.status(404);
        throw new Error("Chat Not Found!");
    }
    else res.json(removedUser);
    });

module.exports={accessChats,getChats,createGroupChat,renameGroupChat,addToGroupChat,removeFromGroupChat};
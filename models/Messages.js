const mongoose=require("mongoose")
const { Schema } = mongoose;

const MessageSchema = new Schema({
    sender:{
        type:Schema.Types.ObjectId,
        ref:"Users"
    },
    content:{
        type:String,
        trim:true
    },
    chat:{
        type:Schema.Types.ObjectId,
        ref:"Chats"
    },
},{
    timestamps:true,
});
const Message=mongoose.model('message',MessageSchema);
module.exports= Message;
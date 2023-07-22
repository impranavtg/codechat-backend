const mongoose=require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    dp:{
        type:String,
        default:"https://cdn-icons-png.flaticon.com/512/6915/6915987.png"
    },
    date:{
        type:Date,
        default:Date.now
    }

},{
    timestamps:true
},);
const user=mongoose.model('users',UserSchema);
module.exports= user;
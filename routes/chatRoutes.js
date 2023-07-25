const express=require("express");
const getuser = require("../middleware/getUser");
const { accessChats,getChats,createGroupChat,renameGroupChat,addToGroupChat,removeFromGroupChat } = require("../controllers/chatControllers");
const router=express.Router();

router.route("/").post(getuser,accessChats);
router.route("/").get(getuser,getChats);
router.route("/group").post(getuser,createGroupChat);
router.route("/rename").put(getuser,renameGroupChat);
router.route("/addGroup").put(getuser,addToGroupChat);
router.route("/removeGroup").put(getuser,removeFromGroupChat);

module.exports=router;
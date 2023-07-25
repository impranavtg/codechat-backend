const express=require("express");
const getuser = require("../middleware/getUser");
const { sendMessage,getMessages } = require("../controllers/messageControllers");
const router=express.Router();

router.route("/").post(getuser,sendMessage);
router.route("/:chatId").get(getuser,getMessages);

module.exports=router;
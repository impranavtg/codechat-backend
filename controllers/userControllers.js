const asyncHandler = require("express-async-handler");
const user = require("../models/Users");

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: "i" } },
          { name: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await user.find(keyword).find({ _id: { $ne: req.user._id } }).select("-password");
  // console.log(users);
  res.send(users);
});


module.exports = { allUsers };
const asyncHandler = require("express-async-handler");
// const { update } = require("../models/Chat");
const Chat = require('../models/Chat');
const User = require("../models/User");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body

  if(!userId) {
    console.log('UserId param not sent with request')
    return res.sendStatus(400)
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } }
    ],
  }).populate("users", "-password").populate("latestMessage")

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email"
  })
  
  if(isChat.length > 0) {
    res.send(isChat[0])
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    }

    try {
      const createdChat = await Chat.create(chatData)

      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password")

      res.status(200).send(fullChat)
    } catch(error) {
      res.status(400)
      throw new Error(error.message)
    }
  }
})

const fetchChats = asyncHandler(async (req, res) => {
  try {
    let chats = await Chat.find({ users: {$elemMatch: {$eq: req.user._id}} }).populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email"
    })

    res.status(200).send(chats)

  } catch(error) {
    res.status(400)
    throw new Error(error.message)
  }
})


const createGroupChat = asyncHandler(async (req, res) => {
  if(!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields" })
  }

  let users = JSON.parse(req.body.users)

  if(users.length < 2) {
    return res.status(400).send("More than 2 users are required to form a group chat")
  }

  users.push(req.user)

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user
    })

    const createdGroupChat = await Chat.findOne({ _id: groupChat._id }).populate("users", "-password").populate("groupAdmin", "-password")

    res.status(200).json(createdGroupChat)
  } catch(error) {
    res.status(400)
    throw new Error(error.message)
  }
})

const renameGroup = asyncHandler(async(req, res) => {
  const { chatId, chatName } = req.body

  try {
    const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName }, {new: true})
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
  
    if(!updatedChat) {
      res.status(404)
      throw new Error("Chat not found")
    } else {
      res.json(updatedChat)
    }

  } catch(error) {
    res.status(400)
    throw new Error(error.message)
  }
})

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body

  const exists = await Chat.find({_id: chatId,
    users: { $elemMatch: {$eq: userId} }
  }).count()
  console.log(exists)
  if(exists > 0) {
    console.log("User already exists in the group")
    res.status(400)
    throw new Error("User already exists in the group")
  } else {
    const added = await Chat.findByIdAndUpdate(chatId, {
      $push: { users: userId }
    }, {
      new: true
    })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
  
    if(!added) {
      res.status(404)
      throw new Error("Chat not found")
    } else {
      res.json(added)
    }
  }
})

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body

  const removed = await Chat.findByIdAndUpdate(chatId, {
    $pull: { users: userId }
  }, {
    new: true
  })
  .populate("users", "-password")
  .populate("groupAdmin", "-password")

  if(!removed) {
    res.status(404)
    throw new Error("Chat not found")
  } else {
    res.json(removed)
  }
})

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup}
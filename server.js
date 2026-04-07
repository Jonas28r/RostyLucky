const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("TU_URL_MONGODB")

const UserSchema = new mongoose.Schema({
    user_id: Number,
    balance: {type:Number, default:0},
    energy: {type:Number, default:0},
    taps: {type:Number, default:0},
    level: {type:Number, default:1},
    mining_end: {type:Number, default:0}
})

const User = mongoose.model("User", UserSchema)

app.post("/login", async(req,res)=>{

    const {user_id} = req.body

    let user = await User.findOne({user_id})

    if(!user){

        user = await User.create({user_id})

    }

    res.json(user)

})

app.post("/tap", async(req,res)=>{

    const {user_id} = req.body

    let user = await User.findOne({user_id})

    user.taps += 1

    if(user.taps % 100 === 0){
        user.energy += 1
    }

    await user.save()

    res.json(user)

})

app.post("/spin", async(req,res)=>{

    const {user_id} = req.body

    let user = await User.findOne({user_id})

    if(user.energy <= 0){
        return res.json({error:"No energy"})
    }

    user.energy -= 1

    const rewards = [
        {type:"usdt", value:0.0001},
        {type:"energy", value:2},
        {type:"nothing", value:0},
        {type:"boost", value:1}
    ]

    const reward = rewards[Math.floor(Math.random()*rewards.length)]

    if(reward.type === "usdt"){
        user.balance += reward.value
    }

    if(reward.type === "energy"){
        user.energy += reward.value
    }

    await user.save()

    res.json({reward,user})

})

app.post("/startMining", async(req,res)=>{

    const {user_id} = req.body

    let user = await User.findOne({user_id})

    const now = Date.now()

    user.mining_end = now + (3 * 60 * 60 * 1000)

    await user.save()

    res.json(user)

})

app.listen(3000, ()=>{

    console.log("Servidor RostyLucky activo")

})

const express = require('express');
const banUser = require('../models/banUser')
const User= require('../models/user')
const router = express.Router();

router.post('/dashboard/ban', async (req, res) => {

    const banuser=new banUser(req.body)
    const updates = Object.keys(req.body)
    const allowedUpdates = ['userId','isBanned','banDuration','reason','isPermanent']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        banuser.save()
        const user = await User.findByIdAndUpdate(req.body.userId, {isBanned:true}, { new: true, runValidators: true })

        if (!user) {
            return res.status(404).send()
        }

        res.status(200).send({
            user:user,
            message:'User Banned successfully'
        })
    } catch (e) {
        res.status(500).send(e)
    }
})




router.post('/dashboard/unban', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['userId','isBanned']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const user = await User.findByIdAndUpdate(req.body.userId, {isBanned:false}, { new: true, runValidators: true })
        const banuser = await banUser.deleteOne({userId:req.body.userId})

        if (!user) {
            return res.status(404).send()
        }

        res.status(200).send({
            user:user,
            message:'User unBanned successfully'
        })
    } catch (e) {
        res.status(500).send(e)
    }
})





router.get('/dashboard/users', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['location','gender']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid filters!' })
    }
    let user=null
    const count=10
    const page =1
    try {

        if(req.body.location!="" && req.body.gender!="" && req.body.location && req.body.gender){
            user = await User.find({
            location:req.body.location,
            gender:req.body.gender
            })
            .sort({ createdAt: -1 })
            .skip(count * (page - 1))
            .limit(count)
        }
        else if(req.body.location!="" &&req.body.location)
        {
            user = await User.find({
            location:req.body.location,
            })
            .sort({ createdAt: -1 })
            .skip(count * (page - 1))
            .limit(count)
        }
        else if(req.body.gender!=""&& req.body.gender)
        {
            user = await User.find({
            gender:req.body.gender
            })
            .sort({ createdAt: -1 })
            .skip(count * (page - 1))
            .limit(count)
        }
        else
        {
            user = await User.find({})
            .sort({ createdAt: -1 })
            .skip(count * (page - 1))
            .limit(count)

        }
        res.status(200).send(
            {
                user:user,
                message:"Users have been retrived successfully"
            })
    } catch (e) {
        res.status(500).send(e)
    }
})



module.exports = router;
import eventModel from '../model/event.model.js'
import orderModel from '../model/order.model.js'
import { BLOG_STATUS_ENUM } from '../utils/constants.js'

const query = {
    lookupUsers:{
        from:"users",
        localField:"userId",
        foreignField:"id",
        as:"EventAuthor"
    },
    projectApprovedEvents:{_id:0,id:1,title:1,image:1,description:1,date:1,time:1,createdAt:1,location:1,authorName:"$EventAuthor.name"},
    projectAllEvents:{_id:0,id:1,title:1,category:1,date:1,time:1,location:1,createdAt:1,authorName:"$EventAuthor.name",status:1}
}

const createEvent = async(req,res)=>{
    try {
        let {userId} = req.headers
        
        await eventModel.create({...req.body,userId})

        res.status(201).send({
            message:"Event Created Successfully"
        })

    } catch (error) {
        console.error(`Error Occoured at ${req.originalUrl} - ${error}`)
        res.status(500).send({
            message: error.message || "Internal Server Error",
            error
        })
    }
}

const buyEvent = async(req,res)=>{
    try {
        console.log("calling")
        let {userId} = req.headers
        let {eventId}=req.params
        await orderModel.create({...req.body,userId,eventId})
        //let order= await orderModel.findOne({userId:userId,paymentstatus:'Not Paid'})
        res.status(201).send({
            message:"Order Created Successfully",
        })

    } catch (error) {
        console.error(`Error Occoured at ${req.originalUrl} - ${error}`)
        res.status(500).send({
            message: error.message || "Internal Server Error",
            error
        })
    }
}

const getAllEvents = async(req,res)=>{
    try {
        let events = await eventModel.aggregate([
            {$lookup:query.lookupUsers},
            {$unwind:"$EventAuthor"},
            {$project:query.projectAllEvents},
            {$sort:{createdAt:-1}}
        ])
        res.status(200).send({
            message:"All Events Fetched Successfully",
            data:events
        })
    } catch (error) {
        console.error(`Error Occoured at ${req.originalUrl} - ${error}`)
        res.status(500).send({
            message: error.message || "Internal Server Error",
            error
        })
    }
}

const getEventById = async(req,res)=>{
    try {
        let {eventId} = req.params
        let data=[]
        let event = await eventModel.findOne({id:eventId})
        if(event){
            data.push(event)
            res.status(200).send({
                message:"Event Fetched Successfully",
                data:data
            })
        }
        else{
            res.status(400).send({
                message:"Invalid Event Id"
            })
        }

    } catch (error) {
        console.error(`Error Occoured at ${req.originalUrl} - ${error}`)
        res.status(500).send({
            message: error.message || "Internal Server Error",
            error
        })
    }
}

const getEventsByUserId = async(req,res)=>{
    try {
        let {userId} = req.headers
        //console.log(req.headers)
        let orders = await orderModel.aggregate([
            {$lookup:{
                from:"events",
                localField:"eventId",
                foreignField:"id",
                as:"myorders"
            }},
            {$unwind:"$myorders"},
            {
                $match:{userId:userId}
            },
            {   
                $project:{
                    _id : 0,
                    id:1,
                    eventId : 1,
                    Event_Title : "$myorders.title",
                    Event_Date:"$myorders.date",
                    Event_Location:"$myorders.location",
                    totalamount:1,
                    tickets:1,
                    paymentstatus:1,
                    status:1
                    
                } 
            }
        ])

        res.status(200).send({
            message:"Event Fetched Successfully",
            data:orders
        })
    } catch (error) {
        console.error(`Error Occoured at ${req.originalUrl} - ${error}`)
        res.status(500).send({
            message: error.message || "Internal Server Error",
            error
        })
    }
}

const getAllApprovedEvents = async(req,res)=>{
    try {
        let events = await eventModel.aggregate([
            {$match:{status:true}},
            {$lookup:query.lookupUsers},
            {$unwind:"$EventAuthor"},
            {$project:query.projectApprovedEvents},
            {$sort:{createdAt:-1}}
        ])
        res.status(200).send({
            message:"Events Fetched Successfully",
            data:events
        })
    } catch (error) {
        console.error(`Error Occoured at ${req.originalUrl} - ${error}`)
        res.status(500).send({
            message: error.message || "Internal Server Error",
            error
        })
    }
}

const updateStatus = async(req,res)=>{
    try {
        let {eventId} = req.params
        let {userId} = req.headers
        let event = await eventModel.findOne({id:eventId})

        if(event)
        {
            if(event.status===true){
                res.status(200).send({
                    message:`Event status already Approved`
                })
            }
            else{
                event.status = req.body.status ?? "In-Active"
            event.updatedBy = userId
            await event.save()
            res.status(200).send({
                message:`Event status updated as ${req.body.status}`
            })
            }
        }
        else
        {
            res.status(400).send({
                message:"Invalid Event Id"
            })
        }
    } catch (error) {
        console.error(`Error Occoured at ${req.originalUrl} - ${error}`)
        res.status(500).send({
            message: error.message || "Internal Server Error",
            error
        })
    }
}
const updateOrder = async(req,res)=>{
    try {
        let {orderId} = req.params
        //let {userId} = req.headers
        let order = await orderModel.findOne({id:orderId})

        if(order)
        {
            if(order.status==='Cancelled'){
                res.status(400).send({
                    message:`Order already Cancelled`
                })
            }
            else{
               
                order.status = req.body.status ?? "Booked"
            await order.save()
            res.status(200).send({
                message:`Order status updated as ${req.body.status}`
            })
            }
        }
        else
        {
            res.status(400).send({
                message:"Invalid Order Id"
            })
        }
    } catch (error) {
        console.error(`Error Occoured at ${req.originalUrl} - ${error}`)
        res.status(500).send({
            message: error.message || "Internal Server Error",
            error
        })
    }
}

const updateLikes = async(req,res)=>{
    try {
        let {blogId} = req.params
        let {userId} = req.headers

        let blog = await blogsModel.findOne({id:blogId})

        if(blog)
        {
            let likes = [...blog.likes]

            likes.includes(userId) ? likes.splice(likes.indexOf(userId),1) : likes.push(userId)

            await blogsModel.updateOne({id:blogId},{$set:{likes:likes}})

            res.status(200).send({
                message:`Action successfull`
            })
        }
        else
        {
            res.status(400).send({
                message:"Invalid Blog Id"
            })
        }
    } catch (error) {
        console.error(`Error Occoured at ${req.originalUrl} - ${error}`)
        res.status(500).send({
            message: error.message || "Internal Server Error",
            error
        })
    }
}

export default {
    createEvent,
    getAllEvents,
    getEventById,
    getEventsByUserId,
    getAllApprovedEvents,
    updateStatus,
    updateLikes,
    buyEvent,
    updateOrder
}
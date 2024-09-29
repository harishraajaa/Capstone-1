import eventModel from '../model/event.model.js'
import orderModel from '../model/order.model.js'
import userModel from '../model/user.model.js'
import { BLOG_STATUS_ENUM } from '../utils/constants.js'
import nodemailer from 'nodemailer'
// import logo from '../assets/logo.jpg'
// import tick from '../assets/tick.jpg'
import config from '../utils/config.js'

const query = {
    lookupUsers:{
        from:"users",
        localField:"userId",
        foreignField:"id",
        as:"EventAuthor"
    },
    projectApprovedEvents:{_id:0,id:1,title:1,image:1,price:1,description:1,date:1,time:1,createdAt:1,location:1,authorName:"$EventAuthor.name"},
    projectAllEvents:{_id:0,id:1,title:1,category:1,price:1,date:1,time:1,location:1,createdAt:1,authorName:"$EventAuthor.name",status:1}
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

const getEventsByAdmin = async(req,res)=>{
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
                $project:{
                    _id : 0,
                    id:1,
                    title : "$myorders.title",
                    category:"$myorders.category",
                    totalamount:1,
                    tickets:1,
                    
                } 
            },
            {$sort:{title:1}}
        ])
        let musictotal=0
        let comedytotal=0
        let workshoptotal=0
        let workshoptickets=0
        let musictickets=0
        let comedytickets=0
        let result=[]
        orders.map((e)=>{
            
            if (e.category==="Music"){
                musictotal=musictotal+e.totalamount
                for(let i in e.tickets)
                {
                    musictickets=musictickets+e.tickets[i]
                }
            }
            if(e.category==="Comedy"){
                comedytotal=comedytotal+e.totalamount
                for(let i in e.tickets)
                {
                    comedytickets=comedytickets+e.tickets[i]
                }
            }
            if(e.category==="Workshops"){
                workshoptotal=workshoptotal+e.totalamount
                for(let i in e.tickets)
                {
                    workshoptickets=workshoptickets+e.tickets[i]
                }
            }
        })

        result.push({
            "category":"Music",
            "totalamount":musictotal,
            "totaltickets":musictickets
        },
        {
            "category":"Comedy",
            "totalamount":comedytotal,
            "totaltickets":comedytickets

        },
        {
            "category":"Workshops",
            "totalamount":workshoptotal,
            "totaltickets":workshoptickets

        })

        res.status(200).send({
            message:"Event Fetched Successfully",
            data:result
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
            {$sort:{createdAt:1}}
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

const getAllApprovedEventsByCategory = async(req,res)=>{
    const {category}=req.body
    try {
        let events = await eventModel.aggregate([
            {$lookup:query.lookupUsers},
            {$match:{category:category}},
            {$unwind:"$EventAuthor"},
            {$project:query.projectApprovedEvents},
            {$sort:{createdAt:1}}
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

const sendEmail = async (user,event,amount) => {
    //mdwu zsql olgs rsiq
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465, //587,
            secure: true, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: config.smtpuser,
                pass: config.smtppwd,
            }
        })
  
        await transporter.sendMail({
            from: '"Harish Events" <Notifications@harishfoods.com>', // sender address
            to: `${user.email}`, // list of receivers
            subject: "You have a tickets, yay!!", // Subject line
            text: "Hello world?", // plain text body
            html:`<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            font-family: Arial, sans-serif;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            border-radius: 5px;
            overflow: hidden;
        }
        .header {
            background: #007bff;
            padding: 20px;
            color: white;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        .footer {
            background: #f4f4f4;
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100%;
            }
        }
    </style>
  </head>
  <body>
    <div class="container">
        <div class="header">
            <img
          alt="Your Company"
          src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5GDhW_JUiKPnqd4ezJ8bX0ZOBlJ64ovr41Q&s'
          className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
          width="48" height="48"
        />
            <h1>Welcome to Harish Events</h1>
        </div>
        <div class="content">
                <h2>Booking Confirmed  <img
                alt="Your Company"
                src='https://p7.hiclipart.com/preview/657/646/363/chroma-key-check-mark-tilde-symbol-green-tick.jpg'
                className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                width="38" height="38"
              /></h2>
            <h4>Hello, ${user.name}!</h4>
            <p>Thank you for purchasing tickets on Harish Events EM app.</p>
            <p>Your tickets are successfully booked. Here's looking forward to an awesome time!</p>
            <p>Here’s ticket/Event details:</p>
            <ul>
                <li><b>Order ID  :</b> ${event.id}</li>
                <li><b>Event Name:</b> ${event.title}</li>
                <li><b>Date      :</b> ${event.date}</li>
                <li><b>Time      :</b> ${event.time}</li>
                <li><b>Venue     :</b> ${event.location[1]},${event.location[2]},${event.location[0]}</li>
                <li><b>Amount    :</b> INR ${amount}/-</li>
                <li><b>Status    :</b> Paid</li>
            </ul>
            <p>If you have any questions, feel free to <a href="mailto:rvharishraajaa@gmail.com">contact us</a>.</p>
            <p>Best regards,<br>Harish Events</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Harish Corporation. All rights reserved.</p>
            <p><a href="#">Unsubscribe</a></p>
        </div>
    </div>
  </body>
            </html>`
        });
  
        console.log("Ticket Confirmation Email sent")
    } catch (error) {
        console.log(error)
    }
    
  }
  
const sendOrderEmail=async(req,res)=>{
    try {
        let {userId}=req.body
        let order = await orderModel.findOne({notified:"no",userId:userId})
        if(order)
        {   order.notified="yes"
            await order.save()
            let user = await userModel.findOne({ id: order.userId })
            let event= await eventModel.findOne({id:order.eventId})
            sendEmail(user,event,order.totalamount)
            res.status(200).send({
                message:`Action successfull`
            })
        }
        else{
            res.status(401).send({
                message:`User/Event not found`
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
    updateOrder,
    getAllApprovedEventsByCategory,
    getEventsByAdmin,
    sendOrderEmail
}
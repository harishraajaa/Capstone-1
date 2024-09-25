import express from "express"
import userrouter from "./user.router.js"
import blogrouter from './blog.router.js'
import eventrouter from './event.router.js'
import razorpayrouter from './razorpay.router.js'

const router=express.Router()
router.use('/users',userrouter)
router.use('/blogs',blogrouter)
router.use('/events',eventrouter)
router.use('/razorpay',razorpayrouter)
router.get('*',(request,response)=>response.send(`<div style='text-align:center'><h1>404 Endpoint Not found</h1></div`))

export default router
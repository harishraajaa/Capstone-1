import express from 'express'
import eventController from '../controller/event.controller.js'
import verifyAuth from '../middleware/verifyAuth.js'
import verifyAdmin from '../middleware/verifyAdmin.js'

const router = express.Router()

router.get('/getAllEvents',verifyAuth,verifyAdmin,eventController.getAllEvents)
router.get('/getEventById/:eventId',verifyAuth,eventController.getEventById)
router.get('/getEventsByUserId',verifyAuth,eventController.getEventsByUserId)
router.get('/getEventsByAdmin',verifyAuth,verifyAdmin,eventController.getEventsByAdmin)
router.get('/getAllApprovedEvents',verifyAuth,eventController.getAllApprovedEvents)
router.post('/getAllApprovedEventsByCategory',verifyAuth,eventController.getAllApprovedEventsByCategory)
router.post('/createEvent',verifyAuth,verifyAdmin,eventController.createEvent)
router.put('/updateStatus/:eventId',verifyAuth,verifyAdmin,eventController.updateStatus)
router.put('/updateOrder/:orderId',verifyAuth,eventController.updateOrder)
router.post('/buyEvent/:eventId',verifyAuth,eventController.buyEvent)
// router.put('/updateLikes/:eventId',verifyAuth,eventController.updateLikes)

export default router
import express from 'express'
import razorpayController from '../controller/razorpay.controller.js'
import verifyAuth from '../middleware/verifyAuth.js'

const router = express.Router()

router.post('/create-order',verifyAuth,razorpayController.createOrder)
router.get('/payment-success',verifyAuth,razorpayController.paymentSucess)
router.post('/verify-payment',verifyAuth,razorpayController.verifyPayment)

export default router
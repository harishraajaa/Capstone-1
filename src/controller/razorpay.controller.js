import Razorpay from "razorpay";
import fs from 'fs'
import {validateWebhookSignature} from 'razorpay/dist/utils/razorpay-utils.js'
import orderModel from "../model/order.model.js";
import Config from '../utils/config.js'


const razorpay = new Razorpay({
    key_id: Config.razorpay_key_id,
    key_secret: Config.razorpay_key_secret,
  });

  // Function to read data from JSON file
const readData = () => {
    if (fs.existsSync('orders.json')) {
      const data = fs.readFileSync('orders.json');
      return JSON.parse(data);
    }
    return [];
  };
  
  // Function to write data to JSON file
  const writeData = (data) => {
    fs.writeFileSync('orders.json', JSON.stringify(data, null, 2));
  };
  
  // Initialize orders.json if it doesn't exist
  if (!fs.existsSync('orders.json')) {
    writeData([]);
  }


  const createOrder=async(req,res)=>{
    try {
        const { amount, currency, receipt, notes } = req.body;
    
        const options = {
          amount: amount * 100, // Convert amount to paise
          currency,
          receipt,
          notes,
        };
    
        const order = await razorpay.orders.create(options);
        
        // Read current orders, add new order, and write back to the file
        const orders = readData();
        orders.push({
          order_id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
          status: 'created',
        });
        writeData(orders);
        res.json(order); // Send order details to frontend, including order ID
      } catch (error) {
        console.error(error);
        res.status(500).send('Error creating order');
      }
  }

// Route to serve the success page
const paymentSucess=async(req,res)=>{
    res.sendFile(path.join(__dirname, 'success.html'));
}

const verifyPayment=async(req,res)=>{
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, eventId,paymentstatus,status,totalamount,tickets} = req.body;
    const requestbody={
      eventId,paymentstatus,status,totalamount,tickets
    }
    let {userId} = req.headers
    
    const secret = razorpay.key_secret;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    try {
      const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);
      if (isValidSignature) {
        // Update the order with payment details
        const orders = readData();
        const order = orders.find(o => o.order_id === razorpay_order_id);
        if (order) {
          order.status = 'paid';
          order.payment_id = razorpay_payment_id;
          writeData(orders);
          buyEvent(requestbody,userId)
        }
        console.log("Payment verification successful")
        res.status(201).json({ status: 'ok'});
      } else {
        res.status(400).json({ status: 'verification_failed' });
        console.log("Payment verification failed");
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Error verifying payment' });
    }
}

const buyEvent = async(req,userId)=>{
  try {
      //console.log("calling")
      await orderModel.create({...req,userId})
      //let order= await orderModel.findOne({userId:userId,paymentstatus:'Not Paid'})
  } catch (error) {
      console.error(`Error Occoured at buyEvent Function`)

  }
}
  


  export default {createOrder,paymentSucess,verifyPayment}

import mongoose from "./index.model.js";
import { v4 as genuuid } from 'uuid';
import { ORDER_STATUS_ENUM,PAYMENT_STATUS_ENUM } from "../utils/constants.js";

const orderSchema = new mongoose.Schema({
    id:{
        type:String,
        default:function (){
            return genuuid()
        }
    },
    userId:{
        type:String,
        required:[true,"userId is required"]
    },
    eventId:{
        type:String,
        required:[true,"eventId is required"]
    },
    tickets:{
        type:Object,
        default:[0,0,0,0]
    },
    status:{
        type:String,
        enum:{
            values: Object.values(ORDER_STATUS_ENUM),
            message: '{VALUE} is not supported'
        },
        required:[true,"status is required"]
    },
    notified:{
        type:String,
        required:[true,"status is required"],
        default:"no"
    },
    paymentstatus:{
        type:String,
        enum:{
            values: Object.values(PAYMENT_STATUS_ENUM),
            message: '{VALUE} is not supported'
        },
        required:[true,"paymentstatus is required"]
    },
    totalamount:{
        type:Number,
        default:0,
        required:[true,"Total Amount Payable is required"]
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

},{
    collection:'orders',
    versionKey:false
})

export default mongoose.model('orders',orderSchema)
import mongoose from "./index.model.js";
import { v4 as genuuid } from 'uuid';
import { CATEGORY_ENUM } from "../utils/constants.js";

const eventSchema = new mongoose.Schema({
    id:{
        type:String,
        default:function (){
            return genuuid()
        }
    },
    title:{
        type:String,
        required:[true,"Title is required"]
    },
    image:{
        type:String,
        required:[true,"Image is required"]
    },
    description:{
        type:String,
        required:[true,"Description is required"]
    },
    category:{
        type:String,
        enum:{
            values: Object.values(CATEGORY_ENUM),
            message: '{VALUE} is not supported'
        },
    },
    status:{
        type:Boolean,
        default:false
    },
    userId:{
        type:String,
        required:[true,"userId is required"]
    },
    location:{
        type:Object,
        default:[],
        required:[true,"Location is required"]
    },
    updatedBy:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    date:{
        type:Date,
        required:[true,"userId is required"]
    },
    time:{
        type:String,
        required:[true,"time is required"]
    }

},{
    collection:'events',
    versionKey:false
})

export default mongoose.model('events',eventSchema)
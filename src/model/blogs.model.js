import mongoose from "./index.model.js";
import {BLOG_STATUS_ENUM} from '../utils/constants.js'
import { v4 as genuuid } from 'uuid';

const blogsSchema = new mongoose.Schema({
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
    status:{
        type:String,
        enum:{
            values: Object.values(BLOG_STATUS_ENUM),
            message: '{VALUE} is not supported'
        },
        default:BLOG_STATUS_ENUM.PENDING
    },
    userId:{
        type:String,
        required:[true,"userId is required"]
    },
    likes:{
        type:Object,
        default:[]
    },
    updatedBy:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

},{
    collection:'blogs',
    versionKey:false
})

export default mongoose.model('blogs',blogsSchema)
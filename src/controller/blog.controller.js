import blogsModel from '../model/blogs.model.js'
import { BLOG_STATUS_ENUM } from '../utils/constants.js'

const query = {
    lookupUsers:{
        from:"users",
        localField:"userId",
        foreignField:"id",
        as:"blogAuthor"
    },
    projectApprovedBlogs:{id:1,title:1,image:1,description:1,createdAt:1,likes:1,authorName:"$blogAuthor.name"},
    projectAllBlogs:{id:1,title:1,image:1,description:1,createdAt:1,authorName:"$blogAuthor.name",status:1}
}

const createBlog = async(req,res)=>{
    try {
        let {userId} = req.headers
        
        await blogsModel.create({...req.body,userId})

        res.status(201).send({
            message:"Blog Created Successfully"
        })

    } catch (error) {
        console.error(`Error Occoured at ${req.originalUrl} - ${error}`)
        res.status(500).send({
            message: error.message || "Internal Server Error",
            error
        })
    }
}

const getAllBlogs = async(req,res)=>{
    try {
        let blogs = await blogsModel.aggregate([
            {$lookup:query.lookupUsers},
            {$unwind:"$blogAuthor"},
            {$project:query.projectAllBlogs},
            {$sort:{createdAt:-1}}
        ])
        res.status(200).send({
            message:"Blogs Fetched Successfully",
            data:blogs
        })
    } catch (error) {
        console.error(`Error Occoured at ${req.originalUrl} - ${error}`)
        res.status(500).send({
            message: error.message || "Internal Server Error",
            error
        })
    }
}

const getBlogById = async(req,res)=>{
    try {
        let {blogId} = req.params
        let blog = await blogsModel.findOne({id:blogId})
        res.status(200).send({
            message:"Blog Fetched Successfully",
            data:blog
        })
    } catch (error) {
        console.error(`Error Occoured at ${req.originalUrl} - ${error}`)
        res.status(500).send({
            message: error.message || "Internal Server Error",
            error
        })
    }
}

const getBlogsByUserId = async(req,res)=>{
    try {
        let {userId} = req.headers
        //console.log(req.headers)
        let blog = await blogsModel.find({userId})
        res.status(200).send({
            message:"Blog Fetched Successfully",
            data:blog
        })
    } catch (error) {
        console.error(`Error Occoured at ${req.originalUrl} - ${error}`)
        res.status(500).send({
            message: error.message || "Internal Server Error",
            error
        })
    }
}

const getAllApprovedBlogs = async(req,res)=>{
    try {
        let blogs = await blogsModel.aggregate([
            {$match:{status:BLOG_STATUS_ENUM.APPROVED}},
            {$lookup:query.lookupUsers},
            {$unwind:"$blogAuthor"},
            {$project:query.projectApprovedBlogs},
            {$sort:{createdAt:-1}}
        ])
        res.status(200).send({
            message:"Blogs Fetched Successfully",
            data:blogs
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
        let {blogId} = req.params
        let {userId} = req.headers

        let blog = await blogsModel.findOne({id:blogId})

        if(blog)
        {
            blog.status = BLOG_STATUS_ENUM[req.body.status] ?? BLOG_STATUS_ENUM.PENDING
            blog.updatedBy = userId

            await blog.save()

            res.status(200).send({
                message:`Blog status updated as ${BLOG_STATUS_ENUM[req.body.status] ?? BLOG_STATUS_ENUM.PENDING}`
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
    createBlog,
    getAllBlogs,
    getBlogById,
    getBlogsByUserId,
    getAllApprovedBlogs,
    updateStatus,
    updateLikes
}
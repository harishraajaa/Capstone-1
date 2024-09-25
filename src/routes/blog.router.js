import express from 'express'
import blogsController from '../controller/blog.controller.js'
import verifyAuth from '../middleware/verifyAuth.js'
import verifyAdmin from '../middleware/verifyAdmin.js'

const router = express.Router()

router.get('/getAllBlogs',verifyAuth,verifyAdmin,blogsController.getAllBlogs)
router.get('/getBlogById/:blogId',verifyAuth,blogsController.getBlogById)
router.get('/getBlogsByUserId',verifyAuth,blogsController.getBlogsByUserId)
router.get('/getAllApprovedBlogs',verifyAuth,blogsController.getAllApprovedBlogs)
router.post('/createBlog',verifyAuth,blogsController.createBlog)
router.put('/updateStatus/:blogId',verifyAuth,verifyAdmin,blogsController.updateStatus)
router.put('/updateLikes/:blogId',verifyAuth,blogsController.updateLikes)

export default router
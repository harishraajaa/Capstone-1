import express from "express"
import userController from "../controller/user.controller.js"
import verifyAuth from '../middleware/verifyAuth.js'
import verifyAdmin from '../middleware/verifyAdmin.js'

const userrouter=express.Router()

userrouter.get('/',(request,response)=>response.send({message:"user Data Fetched"}))
userrouter.get('/getAllUsers',verifyAuth,verifyAdmin,userController.getAllUser)
userrouter.get('/getUserById/:id',verifyAuth,verifyAdmin,userController.getUserById)
userrouter.post('/createUser',userController.createUser)
userrouter.post('/login',userController.login)
userrouter.post('/forgetpassword',userController.forgetPassword)
userrouter.put('/resetpassword/:id',userController.resetPassword)
userrouter.post('/activateUser/:id',userController.activateUser)
userrouter.put('/changePassword',verifyAuth,userController.changePassword)
userrouter.delete('/deleteUserById/:id',verifyAuth,verifyAdmin,userController.deleteUserById)
userrouter.put('/editUserById/:id',verifyAuth,verifyAdmin,userController.editUserById)

export default userrouter
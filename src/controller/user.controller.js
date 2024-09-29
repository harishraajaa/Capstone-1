import 'dotenv/config'
import userModel from '../model/user.model.js'
import auth from '../utils/auth.js'
import nodemailer from 'nodemailer'
import Config from '../utils/config.js'

// function generateRandomID(len){
//     const text='qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890'
//     let random=''
//     for(let i=0;i<len;i++)
//         random+=text[Math.floor(Math.random()*100)%62]
//     return random
// }


const sendEmail = async (user, token, hostname) => {
    //mdwu zsql olgs rsiq
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465, //587,
            secure: true, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: Config.smtpuser,
                pass: Config.smtppwd,
            }
        })

        await transporter.sendMail({
            from: '"Harish Events" <Notifications@harishfoods.com>', // sender address
            to: `${user.email}`, // list of receivers
            subject: "Password Reset Link", // Subject line
            text: "Hello world?", // plain text body
            html: `<b>Hi ${user.name},</b><br><br><p><b>Link for Password reset: </b>${hostname}/resetpassword/${token}</p>
            <br><br><p><b>Note:</b> Link will be valid for next 5 minutes.</p>`, // html body
//             html:`<html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Email Template</title>
//     <style>
//         body {
//             margin: 0;
//             padding: 0;
//             background-color: #f4f4f4;
//             font-family: Arial, sans-serif;
//         }
//         .container {
//             width: 100%;
//             max-width: 600px;
//             margin: auto;
//             background: #ffffff;
//             border-radius: 5px;
//             overflow: hidden;
//         }
//         .header {
//             background: #007bff;
//             padding: 20px;
//             color: white;
//             text-align: center;
//         }
//         .content {
//             padding: 20px;
//         }
//         .footer {
//             background: #f4f4f4;
//             padding: 10px;
//             text-align: center;
//             font-size: 12px;
//             color: #777;
//         }
//         a {
//             color: #007bff;
//             text-decoration: none;
//         }
//         @media only screen and (max-width: 600px) {
//             .container {
//                 width: 100%;
//             }
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <div class="header">
//             <h1>Welcome to Our Newsletter</h1>
//         </div>
//         <div class="content">
//             <h2>Hello, [Recipient's Name]!</h2>
//             <p>Thank you for subscribing to our newsletter. We’re excited to have you on board!</p>
//             <p>Here’s what you can expect in our upcoming editions:</p>
//             <ul>
//                 <li>Latest updates and news</li>
//                 <li>Exclusive offers and promotions</li>
//                 <li>Helpful tips and resources</li>
//             </ul>
//             <p>If you have any questions, feel free to <a href="mailto:support@example.com">contact us</a>.</p>
//             <p>Best regards,<br>Your Company Team</p>
//         </div>
//         <div class="footer">
//             <p>&copy; 2024 Your Company. All rights reserved.</p>
//             <p><a href="#">Unsubscribe</a></p>
//         </div>
//     </div>
// </body>
//             </html>`
        });


    } catch (error) {
        console.log("Error in Send Email Function")
    }
    console.log("Email sent")
}

const sendEmailActivationLink = async (newUser, hostname) => {
    //mdwu zsql olgs rsiq
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465, //587,
            secure: true, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: Config.smtpuser,
                pass: Config.smtppwd,
            }
        })

        await transporter.sendMail({
            from: '"Harish Events" <Notifications@harishfoods.com>', // sender address
            to: `${newUser.email}`, // list of receivers
            subject: "Account Activation Link", // Subject line
            text: "Hello world?", // plain text body
            html: `<b>Hi ${newUser.name},</b><br><br><p><b>Link to Activate your Account: </b>${hostname}/activateUser/${newUser.id}</p>
            <br><br><p><b>Note:</b> Link will be valid for next 5 minutes.</p>`, // html body
        });


    } catch (error) {
        console.log("Error in Send Email Function")
        console.log(error.message)
    }
    console.log("Activation Link Sent")
}



const getAllUser = async (request, response) => {

    try {

        let users = await userModel.find({}, { _id: 0 })

        response.status(200).send({
            message: "Get All Users",
            data: users
        })

    } catch (error) {
        console.log("Error in getAllUser Endpoint")
        response.status(500).send({
            message: "Internal Server Error",
            data: error.message
        })
    }
}

const getUserById = async (request, response) => {

    try {
        let { id } = request.params
        //console.log(id)
        let user = await userModel.findOne({ id: id }, { _id: 0 })
        response.status(200).send({
            message: "Get User",
            data: user
        })

    } catch (error) {
        console.log("Error in getAllUser Endpoint")
        response.status(500).send({
            message: "Internal Server Error",
            data: error.message
        })
    }
}

const createUser = async (request, response) => {

    try {

        let user = await userModel.findOne({ email: request.body.email })

        if (!user) {

            //hash the password
            request.body.password = await auth.hashData(request.body.password)
            await userModel.create(request.body)
            let hostname = request.headers.origin ?? 'http://localhost:8000'
            //
            let newUser = await userModel.findOne({ email: request.body.email })
            sendEmailActivationLink(newUser, hostname)
            response.status(201).send({
                message: "User Created!!! Activation Link has been Sent"
            })
        }
        else {
            response.status(400).send({
                message: "User Already Exists!!!"
            })
        }


    } catch (error) {
        console.log("Error in createUser Endpoint")
        console.log(error.message)
        response.status(500).send({
            message: "Internal Server Error",
            data: error.message
        })
    }
}

const editUserById = async (request, response) => {

    try {
        let { id } = request.params
        let user = await userModel.findOne({ id: id })
        if (user) {
            const { name, email, mobile, status, role, } = request.body
            user.name = name ? name : user.name
            user.email = email ? email : user.email
            user.mobile = mobile ? mobile : user.mobile
            user.status = status ? status : user.status
            user.role = role ? role : user.role

            await user.save()

            response.status(200).send({ message: "Data Saved Successfully" })
        }
        else
            response.status(400).send({ message: "Invalid Id" })


    } catch (error) {
        console.log("Error in EditUserById Endpoint")
        response.status(500).send({
            message: "Internal Server Error",
            data: error.message
        })
    }
}

const deleteUserById = async (request, response) => {

    try {

        let { id } = request.params
        let data = await userModel.deleteOne({ id: id })
        if (data.deletedCount)
            response.status(200).send({ message: "User Deleted Successfully" })
        else
            response.status(400).send({ message: "Invalid Id" })

    } catch (error) {
        console.log("Error in deleteUserById Endpoint")
        response.status(500).send({
            message: "Internal Server Error",
            data: error.message
        })
    }
}

const login = async (req, res) => {
    try {
        let { email, password } = req.body
        let user = await userModel.findOne({ email: email })
        if (user) {
            //compare password
            if (await auth.compareHash(password, user.password)) {
                if (user.status) {
                    const token = auth.createToken({
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        id: user.id,
                        status: user.status
                    })
                    res.status(200).send({
                        message: "Login Successfull",
                        token: token,
                        id: user.id,
                        role: user.role
                    })
                }
                else {
                    res.status(400).send({
                        message: "User Account is not Activated!"
                    })
                }
            }
            else {
                res.status(400).send({
                    message: "Incorrect Password"
                })
            }
        }
        else {
            res.status(400).send({
                message: `User with email ${req.body.email} does not exists`
            })
        }

    } catch (error) {
        console.log(`Error in ${req.originalUrl}`, error.message)
        res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}

const changePassword = async (request, response) => {
    try {

        let token = request.headers.authorization.split(' ')[1]
        let payload = auth.decodeToken(token)
        //console.log(payload)
        if (payload) {
            let user = await userModel.findOne({ id: payload.id })
            if (user) {
                let { oldpassword, newpassword } = request.body

                if (await auth.compareHash(oldpassword, user.password)) {
                    user.password = await auth.hashData(newpassword)

                    await user.save()
                    response.status(200).send({
                        message: "Password Updated Successfully"
                    })
                }
                else
                    response.status(400).send({ message: "Current Password did not match" })

            }

            else {
                response.status(400).send({ message: "User not exists" })
            }
        }
        else {
            response.status(400).send({ message: "Invalid Token" })
        }



    } catch (error) {
        console.log(`Error in ${request.originalUrl}`, error.message)
        response.status(500).send({ message: error.message || "Internal Server Error" })
    }
}

const forgetPassword = async (request, response) => {

    try {
        let { email } = request.body
        let hostname = request.headers.origin ?? 'http://localhost:8000'
        let user = await userModel.findOne({ email: email })
        if (user) {
            const token = auth.createToken({
                email: user.email,
                name: user.name,
                role: user.role,
                id: user.id
            })
            sendEmail(user, token, hostname)
            response.status(201).send({
                message: "Link Created!!!",
            })
        }
        else {
            response.status(400).send({
                message: "User doesn't Exists!!!"
            })
        }

    } catch (error) {
        console.log("Error in forgetPassword Endpoint")
        response.status(500).send({
            message: "Internal Server Error",
            data: error.message
        })
    }
}

const resetPassword = async (request, response) => {
    try {

        //let token = request.headers.authorization.split(' ')[1]
        let { id } = request.params
        //console.log(id)
        let payload = auth.decodeToken(id)
        //console.log(payload)
        if (payload) {
            if (payload.exp > Math.floor(+new Date() / 1000)) {
                let user = await userModel.findOne({ id: payload.id })
                //console.log(user)
                if (user) {
                    let { newpassword } = request.body
                    user.password = await auth.hashData(newpassword)
                    await user.save()

                    response.status(200).send({
                        message: "Password Updated Successfully"
                    })
                }
                else {
                    response.status(400).send({ message: "User not exists" })
                }
            }
            else
                response.status(401).send({ message: "Session Expired" })
        }
        else
            response.status(401).send({
                message: "No Token Found"
            })


    } catch (error) {
        console.log(`Error in ${request.originalUrl}`, error.message)
        response.status(500).send({ message: error.message || "Internal Server Error" })
    }
}

const activateUser = async (request, response) => {
    try {
        let { id } = request.params
        let user = await userModel.findOne({ id: id })
        if (user) {
            if (user.status) {
                response.status(201).send({ message: "Account already Activated! Please Login!" })
            }
            else {
                user.status = 'true'
                await user.save()
                response.status(201).send({ message: "Account Activated!!" })
            }
        }
        else {
            response.status(400).send({ message: "User Doesn't Exists!!" })
        }


    } catch (error) {
        console.log(`Error in ${request.originalUrl}`, error.message)
        response.status(500).send({ message: error.message || "Internal Server Error" })
    }
}

export default {
    getAllUser,
    createUser,
    getUserById,
    editUserById,
    deleteUserById,
    login,
    changePassword,
    forgetPassword,
    resetPassword,
    activateUser
}
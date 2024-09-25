import 'dotenv/config'

export default {
    db_name:process.env.db_name,
    db_url:process.env.db_url,
    SALT:Number(process.env.SALT),
    jwt_secret:process.env.jwt_secret,
    jwt_expiry:process.env.jwt_expiry,
    smtpuser:process.env.smtpuser,
    smtppwd:process.env.smtppwd,
    PORT:process.env.PORT,
    razorpay_key_id:process.env.razorpay_key_id,
    razorpay_key_secret:process.env.razorpay_key_secret
}
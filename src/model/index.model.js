import mongoose from "mongoose"
import config from '../utils/config.js'

main().catch((error)=>console.error('MongoDB Connection Failed',error.message))

async function main(){
    //console.log(`${config.db_url}/${config.db_name}`)
    await mongoose.connect(`${config.db_url}/${config.db_name}`)
    console.log('MongoDB Connected!')
}


export default mongoose
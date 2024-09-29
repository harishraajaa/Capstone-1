import axios from "axios";
import config from '../utils/config'

const api = axios.create({
    baseURL:config.BASE_URL,
    headers:{
        "Content-Type":"application/json"
    }
})

api.interceptors.request.use((config)=>{
    //change the request object
    const token = sessionStorage.getItem("token")
    if(config.authenticate===true && token)
        config.headers.Authorization = `Bearer ${token}`

    return config
},(error)=>Promise.reject(error))


api.interceptors.response.use((response)=>{
    
    return response.data

},(error)=>{
    return Promise.reject(error)
})

export default api
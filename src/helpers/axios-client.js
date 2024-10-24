import axios from "axios";
import { host, schema } from "./constants";

const axiosClient =  axios.create({
    // baseURL : `https://intaj-starstechnology.com/jawda1/laravel-react-app/public/api`
    baseURL : `${schema}://${host}/kitchen-laravel/public/api`
    //  baseURL : `http://192.168.1.5/laravel-react-app/public/api`
    // baseURL : `https://om-pharmacy.com/laravel-react-app/public/api`
})

axiosClient.interceptors.request.use((config)=>{
    const token = localStorage.getItem('ACCESS_TOKEN')
 config.headers.Authorization = `Bearer ${token}`
 return config
})

axiosClient.interceptors.response.use((res)=>{
    return res
},(err)=>{
    console.log(err,'error from client axios')
    const {response} = err
    console.log(response.data)
    console.log(response.status)
    if (response.status == 401) {
        console.log('removing access token')
        localStorage.removeItem('ACCESS_TOKEN')
        
        // alert('Access token removed successfully')
        
    }
    if (response.status == 404) {
        console.log('removing access token')
      //  localStorage.removeItem('ACCESS_TOKEN')
    }
    
    throw err
})

export default axiosClient
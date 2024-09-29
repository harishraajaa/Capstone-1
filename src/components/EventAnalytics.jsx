import React, { useState,useEffect } from 'react'
import NavBar from './NavBar'
//import { BarChart } from '@mui/x-charts'
import ApiRoutes from '../utils/ApiRoutes'
import apiService from '../service/apiService'
import BarChat from './BarChat'

function EventAnalytics() {

    let [data,setData]=useState([])
    let [amount,setAmount]=useState([])

    const getData = async () => {
        let { GET_EVENTS_BY_ADMIN } = ApiRoutes
        try {
          
          let response = await apiService.get(GET_EVENTS_BY_ADMIN.path, {
            authenticate: GET_EVENTS_BY_ADMIN.authenticate
          })
          setData(response.data)
          let dummy=[]
          data.map((e)=>{
            dummy.push(Number(e.totalamount))
          })
          setAmount(dummy)
          
        } catch (error) {
          if (error.status === 401)
            logout()
        }
      }

      useEffect(() => {
        getData()
      }, [])

    

  return <>
  <NavBar />
  <p className='mt-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>Event Analytics Data</p>
    {
       <BarChat data={data}/>  
    }
  
  </>
}

export default EventAnalytics
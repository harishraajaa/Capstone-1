import React, { useState, useEffect } from 'react'
import NavBar from './NavBar'
import Card from './Card'
import useLogout from './UseLogout'
import apiService from '../service/apiService'
import ApiRoutes from '../utils/ApiRoutes'
//import { Button } from '@headlessui/react'
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Button } from 'react-bootstrap'


function Home() {

  let [data, setData] = useState([])
  let [title,setTitle]=useState('')
  let logout = useLogout()

  const getData = async () => {
    let { GET_ALL_APPROVED_EVENTS } = ApiRoutes
    try {
      
      let response = await apiService.get(GET_ALL_APPROVED_EVENTS.path, {
        authenticate: GET_ALL_APPROVED_EVENTS.authenticate
      })
      setData(response.data)
      setTitle("All Events")
      
    } catch (error) {
      if (error.status === 401)
        logout()
    }
  }

  const getDataByCategory=async(catname)=>{

    let { GET_ALL_APPROVED_EVENTS_BY_CATEGORY } = ApiRoutes
    let body={'category':catname}
    console.log(body)
    try {
      let response = await apiService.post(GET_ALL_APPROVED_EVENTS_BY_CATEGORY.path,body,{
        authenticate: GET_ALL_APPROVED_EVENTS_BY_CATEGORY.authenticate
      })
      setData(response.data)
      setTitle(catname)
      
    } catch (error) {
      if (error.status === 401)
        console.log(error)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return <>
    <NavBar />
    <div className="bg-gray-100">
    <ButtonGroup aria-label="Basic example" className='filter'>
      <Button variant="secondary" onClick={()=>getData()}>All</Button>
      <Button variant="secondary"onClick={()=>getDataByCategory("Music")}>Music</Button>
      <Button variant="secondary"onClick={()=>getDataByCategory("Comedy")}>Comedy</Button>
      <Button variant="secondary"onClick={()=>getDataByCategory("Workshops")}>Workshops</Button>
    </ButtonGroup>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-15">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <div className="mt-4 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-20 lg:gap-y-10 lg:space-y-0">
          { 
            data.map((e) => {
              return <Card data={e} key={e.id} />
            })
          }
          </div>
        </div>
      </div>
    </div>

  </>
}

export default Home
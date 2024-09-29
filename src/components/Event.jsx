import React, { useState, useEffect } from 'react'
import NavBar from './NavBar'
import useLogout from './UseLogout'
import apiService from '../service/apiService'
import ApiRoutes from '../utils/ApiRoutes'
import Card from './Card'
import SingleCart from './SingleCart'
import toast from 'react-hot-toast'


function Event() {

    let [data, setdata] = useState([])
    let logout = useLogout()

    const getEvent = async () => {
        let { GET_EVENT_BY_ID } = ApiRoutes
        try {
            let eventId = window.location.href.split('/')[4]
            let response = await apiService.get(`${GET_EVENT_BY_ID.path}/${eventId}`, {
                authenticate: GET_EVENT_BY_ID.authenticate
            })

            setdata(response.data)

        } catch (error) {
            toast.error(error.response.data.message)
            logout()
            console.log(error.response.data.message)
        }
    }

    useEffect(() => {
        getEvent()
    }, [])

    return <>
        <NavBar />
        {
            data.map((e) => {
                return <SingleCart data={e} key={e.id} />
            })
        }


    </>
}

export default Event
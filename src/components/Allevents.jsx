import React,{useState,useEffect} from 'react'
import NavBar from './NavBar'
import { Table } from 'react-bootstrap'
import apiService from '../service/apiService'
import ApiRoutes from '../utils/ApiRoutes'
import toast from 'react-hot-toast'

function Allevents() {

    let [data, setdata] = useState([])

    
    const getAllEvent = async () => {
      let { GET_ALL_EVENTS } = ApiRoutes
      try {
        
        let response = await apiService.get(`${GET_ALL_EVENTS.path}`, {
          authenticate: GET_ALL_EVENTS.authenticate
        })
  
        setdata(response.data)
  
      } catch (error) {
        toast.error(error.response.data.message)
        console.log(error.response.data.message)
      }
    }
  
    const handleStatus=async(id)=>{
      try {
        
        const body={
            "status":true
        }
        let eventId=id
        let response = await apiService.put(`${ApiRoutes.UPDATE_STATUS.path}/${eventId}`,body, {
          authenticate: ApiRoutes.UPDATE_STATUS.authenticate
        })
  
          toast.success(response.message)
          getAllEvent()
      } catch (error) {
        console.log(error.response.data.message)
        toast.error(error.response.data.message)
      }
    }
  
  
    useEffect(() => {
        getAllEvent()
    },[])


  return <>
  <NavBar /> 
    <p className='mt-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>Manage All Events</p>
    {/* <p className='container mt-3 text-right text-l font-bold leading-9 tracking-tight text-gray-900'>Present your e-tickets upon entry.</p> */}
    <div className='container mt-5'>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Event ID</th>
          <th>Title</th>
          <th>Event Date</th>
          <th>City</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
      {
        data.map((e)=>{
          let strdate=new Date(e.date)
          return <tr key={e.id}>
          <td>{e.id.slice(0,7)}</td>
          <td>{e.title}</td>
          <td>{strdate.toDateString()}</td>
          <td>{e.location[0]}</td>
          <td>{e.status?'Active':'In-Active'}</td>
          <td><button
                  onClick={() => handleStatus(e.id)}
                  type="submit"
                  className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                  Approve
                </button>
        </td>
        </tr>
        })
      }
      </tbody>
    </Table>

    </div>
  </>
}

export default Allevents
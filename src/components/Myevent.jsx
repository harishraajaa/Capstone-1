import React,{useState,useEffect} from 'react'
import NavBar from './NavBar'
import useLogout from './UseLogout'
import Table from 'react-bootstrap/Table'
import apiService from '../service/apiService'
import ApiRoutes from '../utils/ApiRoutes'
import { Button } from 'react-bootstrap'
import toast from 'react-hot-toast'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

function Myevent() {

  let [data, setdata] = useState([])
  const [loading, setLoading] = useState(true)
  let logout = useLogout()

  const getEvent = async () => {
    let { GET_EVENTS_BY_USERID } = ApiRoutes
    try {
      
      let response = await apiService.get(`${GET_EVENTS_BY_USERID.path}`, {
        authenticate: GET_EVENTS_BY_USERID.authenticate
      })

      setdata(response.data)
      setLoading(false)

    } catch (error) {
      toast.error(error.response.data.message)
      logout()
      console.log(error.response.data.message)
    }
  }

  const sendBookingEmail = async () => {
        console.log("Email Sending!!!")
        let userId=sessionStorage.getItem('id')
        const data={userId}
        //console.log(data)
        let { SEND_TICKET_EMAIL } = ApiRoutes
        try {

            let response = await apiService.post(SEND_TICKET_EMAIL.path,data,{
                authenticate: SEND_TICKET_EMAIL.authenticate
            })
            console.log(response)
            toast.success( `Ticket details are sent via Email`)
            

        } catch (error) {
            // if (error.status === 401)
                //toast.error(`Error in Sending the ticket`)
        }
    }

  const handleCancel=async(id)=>{
    try {
      
      const body={
          "status":"Cancelled"
      }
      let orderId=id
      let response = await apiService.put(`${ApiRoutes.UPDATE_ORDER.path}/${orderId}`,body, {
        authenticate: ApiRoutes.UPDATE_ORDER.authenticate
      })

        toast.success(response.message)
      getEvent()
    } catch (error) {
      console.log(error.response.data.message)
      toast.error(error.response.data.message)
    }
  }


  useEffect(() => {
    setTimeout(() => {
      getEvent()
    }, 2000);
  },[])

  useEffect(() => {
      setTimeout(() => {
        sendBookingEmail()
      }, 4000);
  },[])

  return <>
    <NavBar />
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Fade
          in={loading}
          style={{
            transitionDelay: loading ? '500ms' : '0ms',
          }}
          unmountOnExit
        >
          <CircularProgress />
        </Fade>
      </Box>
    <p className='mt-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>Manage your Orders</p>
    <p className='container mt-3 text-right text-l font-bold leading-9 tracking-tight text-gray-900'>Present your e-tickets upon entry.</p>
    <div className='container mt-5'>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Title</th>
          <th>Event Date</th>
          <th>City</th>
          <th>No.of.Tickets</th>
          <th>TotalAmount</th>
          <th>Payment Status</th>
          <th>Booking Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
      {
        data.map((e)=>{
          let strdate=new Date(e.Event_Date)
          let notickects=0
          for(let i in e.tickets){
            notickects=notickects+Number(e.tickets[i])
          }
          return <tr key={e.id}>
          <td>{e.id.slice(0,7)}</td>
          <td>{e.Event_Title}</td>
          <td>{strdate.toDateString()}</td>
          <td>{e.Event_Location[0]}</td>
          <td>{notickects}</td>
          <td>{e.totalamount}</td>
          <td>{e.paymentstatus}</td>
          <td>{e.status}</td>
          <td><button
                  onClick={() => handleCancel(e.id)}
                  type="submit"
                  className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                  Cancel
                </button></td>
        </tr>
        })
      }
      </tbody>
    </Table>
    </div>
    

  </>
}

export default Myevent
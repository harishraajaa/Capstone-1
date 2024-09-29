import React from 'react'
import NavBar from './NavBar'
import { useState ,} from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Calendar } from 'primereact/calendar';
import api from '../service/apiService'
import ApiRoutes from '../utils/ApiRoutes';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Createevent() {

  let [date,setDate]=useState()
  const navigate = useNavigate()

  const handleCreate = async(e)=>{
    
    try {
      e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {}
    const price=[]
    const location=[]
    for (let [key, value] of formData.entries())
    {
      if(key==='general')
        {
          price[0]=value
        }
        else if(key==='gold'){
          price[1]=value
        }
        else if(key==='platinum'){
          price[2]=value
        }
        else if(key==='fanspit'){
          price[3]=value
        }
        else if(key==='city'){
          location[0]=value
        }
        else if(key==='venue'){
          location[1]=value
        }
        else if(key==='address'){
          location[2]=value
        }
        else{
          data[key] = value
        }
    }
    data["price"]=price
    data['location']=location
    console.log(data)
    let response = await api.post(ApiRoutes.CREATE_EVENT.path,data,{authenticate:ApiRoutes.CREATE_EVENT.authenticate})
    toast.success(response.message)
    navigate('/allevents')

    } catch (error) {
      console.log(error)
      toast.success(error.response.data.message)
    }
    
  }

  return <>
  <NavBar />
  <p className='mt-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>Event Registration Form</p>
  <div className='container mt-5'>
  <Form onSubmit={handleCreate}>
      <Row className="mb-3">
        <Form.Group as={Col} md="3" controlId="validationCustom01">
          <Form.Label>Event Title</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Title"
            name='title'
          />
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom02">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Image"
            name='image'
          />
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="validationCustomUsername">
          <Form.Label>Description</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Event Description"
            name='description'
          />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="3" controlId="validationCustom03">
          <Form.Label>Event Date</Form.Label>
          
          <Calendar value={date} onChange={(e) => setDate(e.value)} showIcon name='date'/>
          
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom04">
          <Form.Label>Event Time</Form.Label>
          <Form.Control type="text" placeholder="Time" required name='time'/>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom04">
        <Form.Label>Category</Form.Label>
        <Form.Select defaultValue="Choose..." name='category'>
            <option>Choose...</option>
            <option>Music</option>
            <option>Comedy</option>
            <option>Workshops</option>
          </Form.Select>
          </Form.Group>
     
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="3" controlId="validationCustom03">
          <Form.Label>City</Form.Label>
          <Form.Control type="text" placeholder="City" required name='city'/>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom04">
          <Form.Label>Venue</Form.Label>
          <Form.Control type="text" placeholder="Venue" required name='venue'/>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="validationCustom05">
          <Form.Label>Address</Form.Label>
          <Form.Control type="text" placeholder="Full Address" required name='address' />
        </Form.Group>
      </Row>


      <Row className="mb-3">
        <Form.Group as={Col} md="3" controlId="validationCustom03">
          <Form.Label>Fanspit Price</Form.Label>
          <Form.Control type="number" placeholder="₹" required name='fanspit'/>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom04">
          <Form.Label>General</Form.Label>
          <Form.Control type="number" placeholder="₹" required name='general'/>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom05">
          <Form.Label>Gold</Form.Label>
          <Form.Control type="number" placeholder="₹" required name='gold' />
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom05">
          <Form.Label>Platinum</Form.Label>
          <Form.Control type="number" placeholder="₹" required name='platinum' />
        </Form.Group>
      </Row>

      <Row className="mb-3">
      <Form.Group as={Col} md="3">
      <Button type="submit">Submit</Button>
      </Form.Group>
      </Row>
    </Form>
    </div>
  </>
}

export default Createevent
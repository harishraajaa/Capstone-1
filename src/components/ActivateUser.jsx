import React from 'react'
import api from '../service/apiService'
import ApiRoutes from '../utils/ApiRoutes';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png'


function ActivateUser() {

  const navigate = useNavigate()

  const handleActivate = async(e)=>{
    e.preventDefault()
   try {
      //const formData = new FormData(e.currentTarget)
    console.log("Calling Activate API")
    let id=e.view.location.pathname.split('/')[2]
      let response = await api.post(`${ApiRoutes.ACTIVATE_USER.path}/${id}`,{
        authenticate:ApiRoutes.ACTIVATE_USER.authenticate
      })

      toast.success(response.message)

    //   sessionStorage.setItem("token",response.token)
    //   sessionStorage.setItem("role",response.role)

    navigate('/login')

   } catch (error) {
      toast.error(error.response.data.message)
   } 
  }

  return (


<div className="flex min-h-full flex-col justify-center px-8 py-12 lg:px-10">
<div className="sm:mx-auto sm:w-full">
  <img
    alt="Your Company"
    src={logo}
    className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
    width="158" height="48"
  />
  <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
  Click <Link className='font-semibold text-red-600 hover:text-red-500' onClick={handleActivate}>here</Link> to Activate your Account!!
  </h2>
</div>

</div>
  )
}

export default ActivateUser
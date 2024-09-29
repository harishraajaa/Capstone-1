import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import logo from '../assets/logo.png'
import api from '../service/apiService';
import ApiRoutes from '../utils/ApiRoutes';

function Signup() {

  const navigate = useNavigate()

  const handleSignUp = async(e)=>{
    
    try {
      e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {}
    for (let [key, value] of formData.entries())
      data[key] = value
    
    let response = await api.post(ApiRoutes.SIGNUP.path,data,{authenticate:ApiRoutes.SIGNUP.authenticate})

    toast.success(response.message)

    navigate('/login')
    } catch (error) {
      toast.error(error.response.data.message)
    }
    
  }

  return <>
  <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
  <img className="col-span-2 max-h-12 w-full object-contain lg:col-span-1" src={logo} alt="Reform" width="158" height="48"/>
    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Already a Member? 
    <Link to='/login' className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Sign-In Here!</Link>
    </h2>
  </div>

  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form className="space-y-6" onSubmit={handleSignUp}>
      <div>
        <label for="name" className="block text-sm font-medium leading-6 text-gray-900">Name</label>
        <div className="mt-2">
          <input id="name" name="name" type="text"  required className="block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
      </div>
      <div>
        <label for="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
        <div className="mt-2">
          <input id="email" name="email" type="email"  required className="block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
      </div>
      <div>
        <label for="mobile" className="block text-sm font-medium leading-6 text-gray-900">Mobile</label>
        <div className="mt-2">
          <input id="mobile" name="mobile" type="text" required className="block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
      </div>
      <div>
        <label for="password" className="block text-sm font-medium leading-6 text-gray-900">password</label>
        <div className="mt-2">
          <input id="password" name="password" type="password" required className="block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
      </div>
      
      <div>
        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign Up</button>
    </div>
    </form>
  </div>
</div>
  </>
}

export default Signup
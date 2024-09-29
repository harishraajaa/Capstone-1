import React,{useState} from 'react'
import logo from '../../src/assets/logo.png'
import api from '../service/apiService'
import ApiRoutes from '../utils/ApiRoutes';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function Forgetpassword() {

    const [Status,setStatus]=useState("Password reset link will be shared once you submit!!")
    const navigate = useNavigate()
    const handleReset = async(e)=>{
        e.preventDefault()
       try {
          const path=e.target.action.split('/')[4]
          //console.log(path)
          const formData = new FormData(e.currentTarget)
          const data = {}
          for (let [key, value] of formData.entries())
            data[key] = value
    
          console.log(data)
          let response = await api.put(ApiRoutes.PASSWORD_RESET.path+`/${path}`,data,{
            authenticate:ApiRoutes.PASSWORD_RESET.authenticate
          })
    
          toast.success(response.message)
          console.log(response)
          sessionStorage.setItem("token",response.token)
          sessionStorage.setItem("role",response.role)
    
          navigate('/login')
    
       } catch (error) {
          toast.error(error.response.data.message)
       } 
      }

    
  return <>
  <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src={logo}
          className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
          width="158" height="48"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Enter your New Password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" onSubmit={handleReset}>
      <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                New Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="newpassword"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Confirm Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="newpassword"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </>
}

export default Forgetpassword
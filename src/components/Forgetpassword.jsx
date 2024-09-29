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
    const resetLink = async(e)=>{
        e.preventDefault()
       try {
          const formData = new FormData(e.currentTarget)
          const data = {}
          for (let [key, value] of formData.entries())
            data[key] = value
    
          console.log(data)
    
          let response = await api.post(ApiRoutes.GET_RESET_LINK.path,data,{
            authenticate:ApiRoutes.LOGIN.authenticate
          })
    
          toast.success("Password Reset link sent")
          setStatus("Password Reset link sent!!")
          //console.log(response)
          sessionStorage.setItem("token",response.token)
          sessionStorage.setItem("id",response.id)
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
        <h2 className="mt-10 text-center text-1xl font-bold leading-9 tracking-tight text-gray-900">
        {Status}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={resetLink}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            
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

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{' '}
          <Link to='/signup' className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500" >Sign-Up Here!!</Link>
        </p>
      </div>
    </div>
  </>
}

export default Forgetpassword
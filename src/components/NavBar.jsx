import React from 'react'
import logo from '../../src/assets/logo.png'
import useLogout from './UseLogout'
import { Link } from 'react-router-dom'

function NavBar() {

  let options = [
    {
      value: 'All Events',
      path: '/home',
      role: ["admin", "user"]
    },
    {
      value: 'Create Event',
      path: '/createevent',
      role: ["admin"]
    },
    {
      value: 'Manage Event',
      path: '/allevents',
      role: ["admin"]
    },
    {
      value: 'My Events',
      path: '/myevents',
      role: ["admin", "user"]
    },
    {
      value: 'Users',
      path: '/users',
      role: ["admin"]
    },
    {
      value: 'Event Analytics',
      path: '/eventanalytics',
      role: ["admin"]
    }
  ]

  const role = sessionStorage.getItem("role")
  const logout = useLogout()

  return <>
    <nav className="bg-gray-700">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center">
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <img className="h-8 w-auto" src={logo} alt="Your Company" />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {
                  options.filter((option) => option.role.includes(role)).map((e) => {
                    return <Link key={e.path} className='rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white' to={e.path} >{e.value}</Link>
                  })
                }
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">


            {/* <!-- Profile dropdown --> */}
            <div className="relative ml-3">
              <div>
                <button
                  onClick={() => logout()}
                  type="submit"
                  className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                  Logout
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </nav>
  </>
}

export default NavBar
import Login from '../components/Login'
import { Navigate } from "react-router-dom"
import Signup from '../components/Signup'
import ActivateUser from '../components/ActivateUser'
import AdminGuard from "./AdminGuard"
import ProtectedRoute from "./ProtectedRoute"
import Home from '../components/Home'
import Myevent from '../components/Myevent'
import Event from '../components/Event'
import Createevent from '../components/Createevent'
import Users from '../components/Users'
import Forgetpassword from '../components/Forgetpassword'
import PasswordReset from '../components/PasswordReset'
import Allevents from '../components/Allevents'
import EventAnalytics from '../components/EventAnalytics'



const AppRoutes = [
    {
        path:'/login',
        element:<Login/>
    },
    {
        path:'/signup',
        element:<Signup/>
    },
    {
        path:'/activateUser/:id',
        element:<ActivateUser/>
    },
    {
        path:'/home',
        element:<Home/>
    },
    {
        path:'/myevents',
        element:<Myevent/>
    },
    {
        path:'/event/:eventId',
        element:<Event/>
    },
    {
        path:'/createevent',
        element:<Createevent/>
    },
    {
        path:'/users',
        element:<Users/>
    },
    {
        path:'/eventanalytics',
        element:<EventAnalytics/>
    },
    {
        path:'/forgetpassword',
        element:<Forgetpassword/>
    },
    {
        path:'/resetpassword/:id',
        element:<PasswordReset/>
    },
    {
        path:'/allevents',
        element:<Allevents/>
    },
    {
        path:'*',
        element:<Navigate to='/login'/>
    }
]
export default AppRoutes
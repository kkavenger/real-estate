import { BrowserRouter, Routes, Route } from 'react-router-dom'
import About from './Pages/About'
import Home from './Pages/Home'
import Profile from './Pages/Profile'
import Signin from './Pages/Signin'
import Signup from './Pages/Signup'
import Header from './Components/header'
import PrivateRoute from './Components/PrivateRoute'
import CreateListing from './Pages/CreateListing'
import UpdateListing from './Pages/UpdateListing'
import Listing from './Pages/Listing'
import Search from './Pages/Search'

export default function App() {
  return (
    
    <BrowserRouter>
      <Header/>
      <Routes>

        <Route path = "/" element = {<Home/>}/>
        <Route path = "/sign-in" element = {<Signin/>}/>
        <Route path = "/sign-up" element = {<Signup/>}/>
        <Route path = "/about" element = {<About/>}/>
        <Route path = "/listing/:id" element = {<Listing/>}/>
        <Route path = "/search" element = {<Search/>}/>
        <Route element = {<PrivateRoute/>}>
          <Route path = "/profile" element = {<Profile/>}/>
          <Route path = "/create-listing" element = {<CreateListing/>}/>
          <Route path = "/update-listing/:id" element = {<UpdateListing/>}/>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}



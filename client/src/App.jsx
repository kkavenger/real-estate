import { BrowserRouter, Routes, Route } from 'react-router-dom'
import About from './Pages/About'
import Home from './Pages/Home'
import Profile from './Pages/Profile'
import Signin from './Pages/Signin'
import Signup from './Pages/Signup'
import Header from './Components/header'
import PrivateRoute from './Components/PrivateRoute'

export default function App() {
  return (
    
    <BrowserRouter>
      <Header/>
      <Routes>

        <Route path = "/" element = {<Home/>}/>
        <Route path = "/sign-in" element = {<Signin/>}/>
        <Route path = "/sign-up" element = {<Signup/>}/>
        <Route path = "/about" element = {<About/>}/>
        <Route element = {<PrivateRoute/>}>
          <Route path = "/profile" element = {<Profile/>}/>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}



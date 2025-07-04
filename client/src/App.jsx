import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Cars from './pages/Cars'
import Home from './pages/Home'
import CarsDetails from './pages/CarsDetails'
import MyBookings from './pages/MyBookings'
import Footer from './components/Footer'


const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const isOwnerPath = useLocation().pathname.startsWith("/owner")
  return (
    <>
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin}/>}

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/car-details/:id' element={<CarsDetails/>}/>
        <Route path='/cars' element={<Cars/>}/>
        <Route path='/my-bookings' element={<MyBookings/>}/>
      </Routes>


      {!isOwnerPath && <Footer/>}








    </>
  )
}

export default App
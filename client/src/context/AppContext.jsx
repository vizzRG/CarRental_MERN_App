import { createContext } from "react";
import axios from "axios";
import {toast} from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  
  const currency = import.meta.env.VITE_CURRENCY 
  const navigate = useNavigate()
    const [token,setToken] = useState(null)
    const [user,setUser] = useState(null)
    const [isOwner,setIsOwner] = useState(false)
    const [showLogin,setShowLogin] = useState(false)
    const [pickupDate,setPickupDate] = useState("")
    const [returnDate,setReturnDate] = useState("")

    const [cars,setCars] = useState([])

    // function to check if user is logged in
    const fetchUser = async()=>{
      try {
        const {data} = await axios.get("/api/user/data")
        if(data.success){
          setUser(data.user)
          setIsOwner(data.user.role === "owner")
      }else{
        navigate("/")
      }
    
    } catch (error) {
          toast.error(error.message)
      }
    }


    //function to fetch all cars
    const fetchCars = async()=>{
      try {
        const {data} = await axios.get("/api/user/cars")
        if(data.success){
          setCars(data.cars)
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }



    // function to handle logout
    const logout = ()=>{
      localStorage.removeItem("token")
      setToken(null)
      setUser(null)
      setIsOwner(false)
      axios.defaults.headers.common["Authorization"] = ""
      navigate("/")
      toast.success("Logged out successfully")
    }
    // useEffect to retrive the token from local storage
    useEffect(()=>{
      const token = localStorage.getItem("token")
      setToken(token)
      fetchCars()
    },[])

    // useEffect to fetch user data if token is present
    useEffect(()=>{
      if(token){
        axios.defaults.headers.common["Authorization"] = `${token}`
        fetchUser()
      }
    },[token])


    const value = {
        navigate,
        token,
        setToken,
        user,
        setUser,
        isOwner,
        setIsOwner,
        showLogin,
        setShowLogin,
        pickupDate,
        setPickupDate,
        returnDate,
        setReturnDate,
        currency,
        cars,
        setCars,
        fetchUser,
        fetchCars,
        logout
    }



  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
    return useContext(AppContext)
}
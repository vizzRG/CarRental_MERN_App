import React, { useState } from 'react'
import { assets, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import axios from 'axios'
import toast from 'react-hot-toast'
const Sidebar = () => {

    const {user, fetchUser} = useAppContext()
    const location = useLocation()
    const [image,setImage] = useState("")

    const updateImage = async()=>{
    try {
        const formData = new FormData()
        formData.append("image",image)
        const {data} = await axios.post("/api/owner/update-image",formData)
        if(data.success){
            fetchUser()
            toast.success(data.message)
            setImage("")
        }else{
            toast.error(data.message)
        }
    } catch (error) {
      toast.error(error.message)
    }
    }
  return (
    <div className='relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm'>


          <div className='group relative'>
              <label htmlFor="image">
                <img src={image ? URL.createObjectURL(image) : user?.image || "https://images.unsplash.com/photo-1740252117070-7aa2955b25f8?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt="" className='h-11 md:h-20 w-11 md:w-20 rounded-full mx-auto' />
                <input type="file" id='image' accept='image/*' hidden onChange={e=> setImage(e.target.files[0])} />


                <div className='absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer'>
                    <img src={assets.edit_icon} alt="" />
                </div>


              </label>
          </div>

          {image && (
            <button onClick={updateImage} className='absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer'>Save <img src={assets.check_icon} alt="" width={13}  /></button>
          )}
          <p className='mt-2 text-base max-md:hidden '>{user?.name}</p>
          
          <div className='w-full'>
              {ownerMenuLinks.map((link,index)=>(
                <NavLink key={index} to={link.path} className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${link.path === location.pathname ? "bg-primary/10 text-primary" : " text-gray-600"}`}>
                  <img src={link.path === location.pathname ? link.coloredIcon : link.icon} alt="" />
                  <span className='max-md:hidden'>{link.name}</span>
                  <div className={`${link.path===location.pathname && "bg-primary"} w-1.5 h-8 rounded-sm right-0 absolute`}>

                  </div>
                </NavLink>
              ))}
          </div>

    </div>
  )
}

export default Sidebar
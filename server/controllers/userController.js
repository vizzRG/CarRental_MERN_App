import User from "../models/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Car from "../models/Car.js";

//Generate Token
const generateToken = (userId)=>{
    const payload = userId;
    return jwt.sign(payload,process.env.JWT_SECRET)
}

//Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || password.length > 8) {
      return res.json({
        success: false,
        message: "Fill all the fields",
      });
    }

    // checking user exists
    const userExist = await User.findOne({email})
    if(userExist){
        return res.json({
        success: false,
        message: "User already exists",
      })
    }

    const hashedPassword = await bcrypt.hash(password,10)
    const user = await User.create({name,email,password : hashedPassword})
    const token = generateToken(user._id.toString())

    res.json({
        success : true,
        message : "User registered successfully",
        token
    })

  } catch (error) {
    console.log(error.message);
    res.json({
        success : false,
        message : error.message
    })
  }
};

//login User

export const loginUser = async (req,res)=>{
    try {
        const {email,password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.json({success : false, message : "User not Found"})
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.json({
                success:false,
                message : "Email or Password is incorrect"
            })
        }

        const token = generateToken(user._id.toString())
        res.json({
            success : true,
            message : "User logged in successfully",
            token
        })

    } catch (error) {
        console.log(error.message)
        res.json({
            success: false,
            message : error.message
        })
    }

}


//get user data using Token (JWT)
export const getUserData = async(req,res)=>{
  try {
    const {user}=req;
    res.json({
      success: true,
      user
    })
  } catch (error) {
    console.log(error)
    res.json({
      succes: false,
      message : error.message
    })
  }
}


// get all cars for the frontend
export const getCars = async(req,res)=>{
  try {
    const cars = await Car.find({isAvailable : true})
    res.json({
      success: true,
      cars
    })
  } catch (error) {
    console.log(error.message)
    res.json({
      success: false,
      message: error.message
    })
  }
}
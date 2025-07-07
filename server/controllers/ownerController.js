import imagekit from "../config/imageKit.js";
import User from "../models/User.js";
import fs from "fs";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";

export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });
    res.json({
      success: true,
      message: "Now you can list cars",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// api to add owner Car
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    let car = JSON.parse(req.body.carData);
    const imageFile = req.file;

    //upload image to imageKit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    // For URL Generation, works for both images and videos
    var optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "1280" }, // width resizing
        { quality: "auto" }, // Auto Compression
        { format: "webp" }, //conver to modern format
      ],
    });

    const image = optimizedImageUrl;
    await Car.create({ ...car, owner: _id, image });

    res.json({ success: true, message: "Car Added" });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//api to list owner car
export const getOwnerCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });
    res.json({
      success: true,
      cars,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//api to toggle car availability

export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);

    //checking is car belongs to owner
    if (car.owner._id.toString() !== _id.toString()) {
      return res.json({
        success: false,
        message: "Unauthorized",
      });
    }

    car.isAvailable = !car.isAvailable;
    await car.save();
    res.json({
      success: true,
      message: "availability Toggled",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//api to delete a car
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);
    //checking is car belongs to owner
    if (car.owner._id.toString() != _id.toString()) {
      return res.json({
        success: false,
        message: "Unauthorized",
      });
    }

    car.owner = null;
    car.isAvailable = false;
    await car.save();

    res.json({ success: true, message: "Car Removed" });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get Dashboard Data
export const getDashboardData = async (req, res) => {
  try {
    const {_id,role} = req.user
    if(role !== "owner"){
        return res.json({success : false, message : "Unauthorized"})
    }

    const cars = await Car.find({owner : _id})
    const bookings = await Booking.find({owner : _id})
      .populate("car").sort({createdAt : -1})

      const pendingBookings = await Booking.find({owner : _id, status : "pending"})
      const completedBookings = await Booking.find({owner : _id, status : "confirmed"})

        // calculate monthlyRevenue from bookings where status is completed
        const monthlyRevenue = bookings.slice().filter(booking => booking.status === "confirmed").reduce((total, booking) => total + booking.price, 0);


        const dashboardData = {
          totalCars: cars.length,
          totalBookings: bookings.length,
          pendingBookings: pendingBookings.length,
          completedBookings: completedBookings.length,
          recentBookings: bookings.slice(0, 3),
          monthlyRevenue
        }

        res.json({
            success: true,
            dashboardData
        })

  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};


// API to update user Image
export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    const imageFile = req.file;

    //upload image to imageKit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });

    // For URL Generation, works for both images and videos
    var optimizedImageUrl = imagekit.url({
      src: response.url,
      transformation: [
        {
          quality: "auto",
          width: "400",
          format: "webp",
        },
      ],
    });

    const image = optimizedImageUrl;
    // Update user image in database
    await User.findByIdAndUpdate(_id, { image });


    res.json({
      success: true,
      message: "Image Uploaded Successfully",
      imageUrl: image,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
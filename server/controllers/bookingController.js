import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

//Function to check Availability of a Car for a given date

const checkCarAvailability = async (car, pickupDate, returnDate) => {
  const bookings = await Booking.find({
    car,
    pickupDate: { $lte: returnDate },
    returnDate: { $gte: pickupDate },
  });

  return bookings.length === 0; // If no bookings found, car is available
};

// API to check Availability of Cars for the given date
export const checkAvailabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;

    //fetch all available cars based on location and date
    const cars = await Car.find({
      location,
      isAvailable: true,
    });

    //check car availability for the given date using promise
    const availableCarsPromises = cars.map(async (car) => {
      const isAvailable = await checkCarAvailability(
        car._id,
        pickupDate,
        returnDate
      );
      return { ...car._doc, isAvailable: isAvailable };
    });

    let availableCars = await Promise.all(availableCarsPromises);
    availableCars = availableCars.filter((car) => car.isAvailable === true);

    res.json({ success: true, cars: availableCars });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//API to create Booking
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    const isAvailable = await checkCarAvailability(car, pickupDate, returnDate);
    if (!isAvailable) {
      return res.json({
        success: false,
        message: "Car is not available for the selected dates",
      });
    }

    const carData = await Car.findById(car);
    if (!carData) {
      return res.json({
        success: false,
        message: "Car not found",
      });
    }

    // Calculate total price based on the pickUpDate And returnDate
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
    const price = carData.pricePerDay * noOfDays;

    await Booking.create({
      car,
      owner: carData.owner,
      user: _id,
      pickupDate,
      returnDate,
      price,
    });

    res.json({
      success: true,
      message: "Booking created successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//API to list user bookings
export const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user;

    const bookings = await Booking.find({ user: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//API to get Owner bookings
export const getOwnerBookings = async (req, res) => {
  try {
    if(!req.user.role !== "owner") {
      return res.json({
        success: false,
        message: "Unauthorized access",
      });
    }
    const { _id } = req.user;

    const bookings = await Booking.find({ owner: _id })
      .populate("car user")
      .select("-user.password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//API to change booking status
export const changeBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    const { _id } = req.user;


    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if the booking belongs to the owner
    if (booking.owner.toString() !== _id.toString()) {
      return res.json({
        success: false,
        message: "Unauthorized access",
      });
    }

    booking.status = status;
    await booking.save();

    res.json({
      success: true,
      message: "Booking status updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
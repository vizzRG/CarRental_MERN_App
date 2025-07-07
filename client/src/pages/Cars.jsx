import { useEffect, useState } from "react";
import Title from "../components/Title";
import CarCard from "../components/CarCard";
import { assets, dummyCarData } from "../assets/assets";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "motion/react";
const Cars = () => {
  const [searchParams] = useSearchParams();

  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");

  const { cars } = useAppContext();

  const [filteredCars, setFilteredCars] = useState([]);

  const [input, setInput] = useState("");

  const inSearchData = pickupLocation && pickupDate && returnDate;

  const applyFilter = async () => {
    if (input === "") {
      setFilteredCars(cars);
      return null;
    }

    const filtered = cars.slice().filter((car) => {
      return (
        car.brand.toLowerCase().includes(input.toLowerCase()) ||
        car.model.toLowerCase().includes(input.toLowerCase()) ||
        car.category.toLowerCase().includes(input.toLowerCase()) ||
        car.transmission.toLowerCase().includes(input.toLowerCase())
      );
    });
    setFilteredCars(filtered);
  };
  const searchCarAvailabilty = async () => {
    const { data } = await axios.post("/api/bookings/check-availability", {
      location: pickupLocation,
      pickupDate,
      returnDate,
    });

    if (data.success) {
      setFilteredCars(data.availableCars);
      if (data.availableCars.length === 0) {
        toast("No Cars available");
      }
      return null;
    }
  };

  useEffect(() => {
    inSearchData && searchCarAvailabilty();
  }, []);
  useEffect(() => {
    cars.length > 0 && !inSearchData && applyFilter();
  }, [input, cars]);
  return (
    <div>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center py-20 bg-light max-md:px-4"
      >
        <Title
          title="Available Cars"
          subTitle="Browse our selection of premium vehicles available for your next adventure"
        />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow"
        >
          <img
            src={assets.search_icon}
            alt="search_icon"
            className="w-4.5 h-4.5 mr-2"
          />

          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search by make, model, or features"
            className="w-full h-full outline-none text-gray-500"
          />

          <img
            src={assets.filter_icon}
            alt="search_icon"
            className="w-4.5 h-4.5 ml-2"
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10"
      >
        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
          Showing {filteredCars.length} Cars
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
          {filteredCars.map((car, index) => (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              key={index}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Cars;

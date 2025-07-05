import { useState, useEffect } from "react";
import { assets, dummyCarData } from "../../assets/assets";
import Title from "../../components/owner/Title";

const ManageCars = () => {
  const [car, setCar] = useState([]);
  const currency = import.meta.env.VITE_CURRENCY;
  
  const fetchOwnerCars = async () => {
    setCar(dummyCarData);
  };
  console.log(car)
  
  useEffect(() => {
    fetchOwnerCars();
  }, []);
  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Your Cars"
        subTitle="View all listed cars, update their details, or remove them from the booking platform"
      />

      <div className="max-w-3xl w-full rounded-md border-borderColor mt-6">
        <table className="w-full border border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium max-md:hidden">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {car.map((car, index) => (
              <tr key={index} className="border-t border-borderColor">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={car.image}
                    alt=""
                    className="w-12 h-12 aspect-square object-cover rounded-md"
                  />
                  <div className="max-md:hidden">
                    <p className="font-medium">
                      {car.brand} {car.model}
                    </p>
                    <p className="font-medium text-gray-500">
                      {car.seating_capacity} • {car.transmission}
                    </p>
                  </div>
                </td>

                <td className="p-3 max-md:hidden">{car.category}</td>
                <td className="p-3 ">
                  {currency} {car.pricePerDay}/day
                </td>
                <td className="p-3 max-md:hidden">
                  <span className={`p-3 py-1 rounded-full text-sm ${car.isAvaliable ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                    {car.isAvaliable ?  "Available": "Not Available"}
                  </span>
                </td>

                <td className="flex items-center p-3">
                  <img src={car.isAvaliable ? assets.eye_close_icon : assets.eye_icon} className="cursor-pointer" alt="" />
                  <img src={assets.delete_icon} className="cursor-pointer" alt="" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCars;

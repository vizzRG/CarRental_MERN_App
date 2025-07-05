import {useState,useEffect, use} from 'react'
import { dummyMyBookingsData } from '../../assets/assets'
import Title from '../../components/owner/Title'

const ManageBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const [bookings, setBookings] = useState([])

  const fetchOwnerBookings = async () => {
    setBookings(dummyMyBookingsData)
  }

  useEffect(() => {
    fetchOwnerBookings()
  }, [])
  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses"
      />

      <div className="max-w-3xl w-full rounded-md border-borderColor mt-6">
        <table className="w-full border border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium">Date Range</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium max-md:hidden">Payment</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index} className="border-t border-borderColor text-gray-500">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={booking.car.image}
                    alt=""
                    className="w-12 h-12 aspect-square object-cover rounded-md"
                  />
                    <p className="font-medium max-md:hidden">
                      {booking.car.brand} {booking.car.model}
                    </p>
                   
                </td>

                <td className="p-3 max-md:hidden">
                  {booking.pickupDate.split("T")[0]} To {booking.returnDate.split("T")[0]}

                </td>
                <td className="p-3 ">
                  {currency} {booking.price}
                </td>
                <td className="p-3 max-md:hidden">
                  <span className={`p-3 py-1 rounded-full text-sm bg-gray-100 `}>
                    offline
                  </span>
                </td>

                <td className='p-3'>
                  {booking.status === "pending" ? (
                    <select value={booking.status} className='px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none'>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="confirmed">Confirmed</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status=== 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{booking.status}</span>
                  )}
                </td>

                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageBookings
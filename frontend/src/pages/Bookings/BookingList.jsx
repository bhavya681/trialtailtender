import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  MessageCircle,
  DollarSign,
  Search,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { MdOutlinePreview, MdRateReview } from "react-icons/md";
const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [role, setRole] = useState(localStorage.getItem("user"));
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) => prev.filter((booking) => booking._id !== id));
        toast.success("Booking successfully deleted");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          `Booking ${status === "confirmed" ? "confirmed" : "rejected"} successfully`
        );
        fetchDetails();
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const fetchDetails = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setBookings(data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const nameMatch = role === "owner" 
      ? booking?.sitter?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      : booking?.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === "all" || booking.status === statusFilter;
    const serviceMatch = serviceFilter === "all" || booking.serviceType === serviceFilter;
    
    return nameMatch && statusMatch && serviceMatch;
  });

  return (
    <div className="max-w-7xl mx-auto mt-5 p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between mt-16 gap-4 sm:gap-0">
        <div className="flex items-center">
          <Calendar className="h-8 w-8 text-blue-600 mr-2" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Your Bookings</h2>
        </div>
        {role === "owner" && (
          <Link
            to="/book"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
          >
            <span className="text-lg font-medium">Create New Booking</span>
            <span className="text-4xl font-medium pb-1">+</span>
          </Link>
        )}
      </div>

      {/* Search and Filter Section */}
      <div className="mt-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search by ${role === "owner" ? "sitter" : "owner"} name...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Services</option>
              <option value="Grooming">Grooming</option>
              <option value="Boarding">Boarding</option>
              <option value="Daycare">Daycare</option>
              <option value="Veterinary Check-Up">Veterinary Check-Up</option>
            </select>
          </div>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-md mt-6">
          <Calendar className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-5">No bookings found</p>
          {role === "owner" && (
            <Link
              to="/book"
              className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              Create New Booking
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <AnimatePresence>
            {filteredBookings.map((booking) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-xl ${
                  booking.status === "completed"
                    ? "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200"
                    : "bg-gradient-to-br from-white to-blue-50 shadow-md"
                }`}
              >
                <div className="flex flex-col justify-between h-full">
                  <div>
                    {booking.status === "completed" && (
                      <div className="flex justify-end mb-2">
                        <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Completed
                        </div>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {role === "owner" ? "Sitter" : "Owner"}:{" "}
                      <span className="text-blue-600">{booking?.sitter?.name || booking?.owner?.name}</span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Link
                        to={`/chat/${booking.sitter._id}`}
                        className="flex items-center bg-blue-100 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Chat Now
                      </Link>
                      {booking.status === "confirmed" && (
                        <a
                          href={booking?.sitter?.paymentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center bg-emerald-100 text-emerald-600 px-4 py-2 rounded-full hover:bg-emerald-200 transition-colors"
                        >
                          <DollarSign className="h-5 w-5 mr-2" />
                          Pay Now
                        </a>
                      )}
                    </div>
                    <div className="space-y-2 text-gray-600">
                      <p className="flex items-center">
                        <span className="font-medium mr-2">Service:</span>
                        <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                          {booking.serviceType}
                        </span>
                      </p>
                      <p className="flex items-center">
                        <span className="font-medium mr-2">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-600' : 
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-600' : 
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {booking.status}
                        </span>
                      </p>
                      <p className="flex items-center">
                        <span className="font-medium mr-2">Pet(s):</span>
                        {booking?.pets?.map((pet) => pet.name).join(", ")}
                      </p>
                      <p className="flex items-center">
                        <span className="font-medium mr-2">Notes:</span>
                        {booking.notes || "None"}
                      </p>
                      <div className="flex items-center text-sm bg-gray-50 px-3 py-2 rounded-lg">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                          {new Date(booking.startDate).toLocaleDateString()} to{" "}
                          {new Date(booking.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    {role === "owner" ? (
                      <>
                           <Link
                          to={`/reviews/${booking?.sitter?._id}`}
                          className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                        >
                          <MdOutlinePreview  className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/add/review/${booking?.sitter?._id}`}
                          className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                        >
                          <MdRateReview className="h-5 w-5" />
                        </Link>
                
                        <Link
                          to={`/editbook/${booking._id}`}
                          className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                        >
                          <Edit2 className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, "confirmed")}
                          className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, "rejected")}
                          className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default BookingList;

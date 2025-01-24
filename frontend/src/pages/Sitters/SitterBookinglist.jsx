import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const SitterBookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newId, setNewId] = useState('');
  const userName = localStorage.getItem('userName');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    serviceType: '',
    dateRange: ''
  });

  useEffect(() => {
    const fetchSitters = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/sitters`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          const sitters = data?.sitters || [];
          const matchingSitter = sitters.find((sitter) => sitter?.name === userName);
          if (matchingSitter) {
            setNewId(matchingSitter._id);
          }
        }
      } catch (error) {
        console.error('Error fetching sitters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSitters();
  }, [userName]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!newId) return;

      try {
        const response = await fetch(`http://localhost:5000/api/bookings/bookings/sitter/${newId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setBookings(data.bookings);
        } else {
          console.error('Failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [newId]);

  const filteredBookings = bookings.filter(booking => {
    // Ensure booking.owner and booking.pets are defined before accessing their properties
    const ownerName = booking.owner?.name?.toLowerCase() || '';
    const petNamesMatch = booking.pets?.some(pet => pet.name.toLowerCase().includes(searchTerm.toLowerCase())) || false;

    const matchesSearch =
      ownerName.includes(searchTerm.toLowerCase()) ||
      petNamesMatch ||
      booking.serviceType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filters.status || booking.status === filters.status;
    const matchesService = !filters.serviceType || booking.serviceType === filters.serviceType;

    let matchesDate = true;
    if (filters.dateRange) {
      const today = new Date();
      const bookingDate = new Date(booking.startDate);

      switch(filters.dateRange) {
        case 'today':
          matchesDate = bookingDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today.setDate(today.getDate() - 7));
          matchesDate = bookingDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
          matchesDate = bookingDate >= monthAgo;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesService && matchesDate;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-[6rem] p-6">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-gray-800 mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        Your Bookings
      </motion.h2>

      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by owner, pet name or service..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4 flex-wrap md:flex-nowrap">
            <select
              className="p-3 rounded-lg border border-gray-300 min-w-[150px]"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <select
              className="p-3 rounded-lg border border-gray-300 min-w-[150px]"
              value={filters.serviceType}
              onChange={(e) => setFilters({...filters, serviceType: e.target.value})}
            >
              <option value="">All Services</option>
              <option value="Walking">Walking</option>
              <option value="Boarding">Boarding</option>
              <option value="Daycare">Daycare</option>
            </select>

            <select
              className="p-3 rounded-lg border border-gray-300 min-w-[150px]"
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
            </select>
          </div>
        </div>
      </div>

      {filteredBookings.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-x-auto rounded-lg shadow-xl bg-white border border-gray-200"
        >
          <table className="min-w-full bg-gradient-to-r from-blue-50 via-white to-purple-50 rounded-lg">
            <thead className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 text-white">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-bold uppercase">Owner</th>
                <th className="py-4 px-6 text-left text-sm font-bold uppercase">Pet Name</th>
                <th className="py-4 px-6 text-left text-sm font-bold uppercase">Pet Type</th>
                <th className="py-4 px-6 text-left text-sm font-bold uppercase">Service Type</th>
                <th className="py-4 px-6 text-left text-sm font-bold uppercase">Chat</th>
                <th className="py-4 px-6 text-left text-sm font-bold uppercase">Start Date</th>
                <th className="py-4 px-6 text-left text-sm font-bold uppercase">End Date</th>
                <th className="py-4 px-6 text-left text-sm font-bold uppercase">Status</th>
                <th className="py-4 px-6 text-left text-sm font-bold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <motion.tr
                  key={booking._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`hover:bg-blue-100 transition-colors duration-300 ${
                    booking.status === 'completed' ? 'text-gray-400' : 'text-gray-700'
                  }`}
                >
                  {/* Safely access properties */}
                  <td className="py-4 px-6 border-b border-gray-200">{booking.owner?.name || 'Unknown Owner'}</td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    {booking.pets?.map((pet) => pet.name).join(', ') || 'No Pets'}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    {booking.pets?.map((pet) => pet.type).join(', ') || 'No Pets'}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200">{booking.serviceType}</td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    <Link
                      to={`/chat/${booking.owner?._id}_${newId}`}
                      className="text-blue-600 hover:underline hover:text-blue-800"
                    >
                      Chat with Owner
                    </Link>
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    {new Date(booking.startDate).toLocaleDateString()} at{' '}
                    {new Date(booking.startDate).toLocaleTimeString()}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    {new Date(booking.endDate).toLocaleDateString()} at{' '}
                    {new Date(booking.endDate).toLocaleTimeString()}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        booking.status === 'completed'
                          ? 'bg-green-100 text-green700'
                          : 'bg-yellow100 text-yellow700'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="py4 px6 border-b border-gray200">
                    <Link
                      to={`/edit-status/${booking._id}`}
                      className="text-blue600 hover:underline hover:text-blue800"
                    >
                      Edit Status
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      ) : (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray600 text-center text-lg bg-white p8 rounded-lg shadow-lg"
        >
          No bookings found matching your criteria.
        </motion.p>
      )}
    </div>
  );
};

export default SitterBookingList;

import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const AddBooking = () => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    serviceType: '',
    sitterId: '',
    pets: '',
    notes: '',
  });
  const [sitters, setSitters] = useState([]);
  const [pets, setPets] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sittersRes = await fetch('http://localhost:5000/api/sitters', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const petsRes = await fetch('http://localhost:5000/api/pets', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const sittersData = await sittersRes.json();
        const petsData = await petsRes.json();
        setSitters(sittersData?.sitters || []);
        setPets(petsData?.pets || []);
      } catch (error) {
        console.error(error);
        setSitters([]);
        setPets([]);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Successfully Created Booking');
        navigate('/booklist');
      } else {
        toast.error(data.message || 'Failed to Create Booking');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while creating the booking');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8 mt-16"
      >
        <div className="flex items-center mb-6">
          <Calendar className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-semibold text-gray-800">New Booking</h2>
        </div>
        <form onSubmit={handleCreate} className="space-y-6">
          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a service</option>
              <option value="Grooming">Grooming</option>
              <option value="Boarding">Boarding</option>
              <option value="Daycare">Daycare</option>
              <option value="Veterinary Check-Up">Veterinary Check-Up</option>
            </select>
          </div>

          {/* Pet Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pet</label>
            <select
              name="pets"
              value={formData.pets}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a pet</option>
              {pets.map((pet) => (
                <option key={pet._id} value={pet._id}>
                  {pet.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sitter Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Sitter</label>
            <select
              name="sitterId"
              value={formData.sitterId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a sitter</option>
              {sitters.map((sitter) => (
                <option key={sitter._id} value={sitter._id}>
                  {sitter.name} ({sitter.email})
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date & Time</label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date & Time</label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Create Booking
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddBooking;

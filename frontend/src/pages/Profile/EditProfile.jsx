import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    latitude: '',
    longitude: '',
    role: '',
    profile: ''
  });
  const [locationUpdated, setLocationUpdated] = useState(false);

  const fetchDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setData(data.user);
        setForm({
          name: data.user.name,
          email: data.user.email,
          latitude: data.user.location.coordinates[1] || '', // Latitude
          longitude: data.user.location.coordinates[0] || '', // Longitude
          role: data.user.role,
          profile: data.user.profile
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch user details.");
    }
  };

  useEffect(() => { fetchDetails(); }, []);

  const changeVal = (e) => {
    setForm((prevForm) => ({ ...prevForm, [e.target.name]: e.target.value }));
  };

  const updateDetails = async (e) => {
    e.preventDefault();
    
    // Validate latitude and longitude inputs
    const lat = parseFloat(form.latitude);
    const lon = parseFloat(form.longitude);
    
    if (isNaN(lat) || isNaN(lon)) {
      toast.error("Please enter valid latitude and longitude values.");
      return;
    }

    try {
      const updates = {
        name: form.name,
        email: form.email,
        role: form.role,
        profile: form.profile
      };

      // Include location if it has been updated
      if (locationUpdated || (form.latitude && form.longitude)) {
        updates.location = {
          type: 'Point',
          coordinates: [
            lon, // Longitude first
            lat  // Latitude second
          ],
        };
      }

      const res = await fetch('http://localhost:5000/api/auth/edit-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Successfully Updated');
        navigate('/profile');
      } else {
        toast.success(data.message || 'Update failed');
        navigate('/profile');
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating.");
    }
  };

  const handleLocationUpdate = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Update form state with new coordinates
          setForm((prevForm) => ({
            ...prevForm,
            latitude,
            longitude
          }));

          // Set locationUpdated to true to indicate that location has changed
          setLocationUpdated(true);

          // Optionally, you can directly update the backend here if needed
          try {
            const updates = {
              location: {
                type: 'Point', // Ensure type comes first
                coordinates: [parseFloat(longitude), parseFloat(latitude)], // Longitude first, Latitude second
              }
            };

            const res = await fetch('http://localhost:5000/api/auth/edit-profile', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify(updates),
            });

            const data = await res.json();
            if (data.success) {
              toast.success('Location updated successfully!');
            } else {
              toast.success(data.message || 'Location update failed');
            }
          } catch (error) {
            console.log(error);
            toast.error("An error occurred while updating location.");
          }
        },
        (error) => {
          console.error(error);
          toast.error("Unable to retrieve your location.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center mt-[81px] justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Edit Profile</h2>
        <form onSubmit={updateDetails}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter your name"
              name="name"
              onChange={changeVal}
              value={form.name}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter your email"
              name="email"
              onChange={changeVal}
              value={form.email}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Profile Image</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter link of your profile picture"
              name="profile"
              onChange={changeVal}
              value={form.profile}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Latitude</label>
            <input
              type="number"
              step="any" // Allows decimal values for latitude
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter latitude"
              name="latitude"
              onChange={changeVal}
              value={form.latitude}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Longitude</label>
            <input
              type="number"
              step="any" // Allows decimal values for longitude
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter longitude"
              name="longitude"
              onChange={changeVal}
              value={form.longitude}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter your role"
              name="role"
              onChange={changeVal}
              value={form.role}
            />
          </div>
          <div className="mb-4 flex justify-center gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full md:w-auto hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            >
              Save Changes
            </button>
            <button
              type="button"
              className="bg-green-600 text-white px-6 py-3 rounded-lg w-full md:w-auto hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
              onClick={handleLocationUpdate}
            >
              Update Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

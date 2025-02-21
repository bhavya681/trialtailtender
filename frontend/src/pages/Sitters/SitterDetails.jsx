import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaStar } from 'react-icons/fa';

const SitterDetails = () => {
  const [sitters, setSitters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [address, setAddress] = useState({});
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showClosest, setShowClosest] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(0); 

  useEffect(() => {
    const savedStuff = JSON.parse(localStorage.getItem('favourites')) || [];
    setFavourites(savedStuff);
  }, []);

  const saveFavourites = (fav) => {
    setFavourites(fav);
    localStorage.setItem('favourites', JSON.stringify(fav));
  };

  const toggleFavourite = (sitter) => {
    const savedStuff = favourites.some((fav) => fav._id === sitter._id)
      ? favourites.filter((fav) => fav._id !== sitter._id)
      : [...favourites, sitter];
    saveFavourites(savedStuff);
    toast.success(favourites.some((fav) => fav._id === sitter._id) ? 'Removed from Favourites' : 'Added to Favourites');
  };

  const navigate = useNavigate();

  // Fetch all sitters
  const fetchAllSitters = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sitters/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (data.success) setSitters(data.sitters);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch user's current location
  const fetchUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          toast.success('Location detected successfully!');
        },
        () => toast.error('Failed to get location')
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  // Calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km 
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // Fetch all sitters on mount
  useEffect(() => {
    fetchAllSitters();
    fetchUserLocation();
  }, []);

  // Get address from coordinates
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      if (!response.ok) throw new Error('Failed to fetch location');
      const data = await response.json();
      return data.display_name || 'Unknown Location';
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Unknown Location';
    }
  };

  // Fetch addresses for sitters
  useEffect(() => {
    const fetchAddresses = async () => {
      const newAddresses = {};
      for (const sitter of sitters) {
        if (sitter.location?.coordinates) {
          const [lon, lat] = sitter.location.coordinates;
          const addr = await getAddressFromCoordinates(lat, lon);
          newAddresses[sitter._id] = addr;
        }
      }
      setAddress(newAddresses);
   
    };
    if (sitters.length) fetchAddresses();
  }, [sitters]);

  // Get closest sitters
  const closestSitters = sitters
    .map((sitter) => {
      const [lon, lat] = sitter.location?.coordinates || [];
      return {
        ...sitter,
        distance: currentLocation
          ? calculateDistance(currentLocation.latitude, currentLocation.longitude, lat, lon)
          : null,
      };
    })
    .filter((sitter) => sitter.distance !== null)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);

  // Calculate average rating for a sitter
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return null;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1); // Return average rounded to one decimal place
  };

  // Filter sitters based on search term and rating filter
  const filteredSitters = (showClosest ? closestSitters : sitters).filter((sitter) =>
    sitter.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (ratingFilter ? calculateAverageRating(sitter.reviews) >= ratingFilter : true)
  );

  return (
  <>
  <div className="max-w-7xl mt-10 mx-auto py-16 px-6 sm:px-8 lg:px-10 bg-gradient-to-br from-indigo-100 via-white to-purple-200">
  <section className="rounded-3xl shadow-2xl bg-white/80 backdrop-blur-xl p-10">
    <h2 className="text-5xl font-extrabold text-center text-indigo-800 mb-10 drop-shadow-lg">
      Find Your Perfect Sitter
    </h2>

    {/* Search and Filters */}
    <div className="flex flex-wrap justify-between items-center mb-10 gap-6">
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-5 py-3 border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:max-w-lg"
      />
      <div className="flex gap-4">
        <button
          onClick={() => setShowClosest(true)}
          className="px-8 py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
        >
          Show Closest Sitters
        </button>
        <button
          onClick={() => setShowClosest(false)}
          className="px-8 py-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105"
        >
          Show All Sitters
        </button>
      </div>
    </div>

    {/* Rating Filter */}
    <div className="mb-8">
      <label
        htmlFor="ratingFilter"
        className="block text-lg font-medium text-gray-700 mb-2"
      >
        Filter by Rating:
      </label>
      <select
        id="ratingFilter"
        value={ratingFilter}
        onChange={(e) => setRatingFilter(Number(e.target.value))}
        className="block w-full sm:max-w-xs border border-gray-300 rounded-full shadow-lg focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2"
      >
        <option value={0}>All Ratings</option>
        <option value={1}>1 Star & Up</option>
        <option value={2}>2 Stars & Up</option>
        <option value={3}>3 Stars & Up</option>
        <option value={4}>4 Stars & Up</option>
        <option value={5}>5 Stars</option>
      </select>
    </div>

    {/* Sitters */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredSitters.map((sitter) => (
        <div
          key={sitter._id}
          className="bg-gradient-to-r from-white to-indigo-50 rounded-2xl shadow-2xl p-6 transform transition hover:scale-105 hover:shadow-3xl"
        >
          <img
            src={sitter.profile || '/placeholder.svg'}
            alt={sitter.name}
            className="w-32 h-32 object-cover rounded-full mx-auto shadow-md"
          />
          <h3 className="text-2xl font-bold text-center mt-6 text-gray-900">
            {sitter.name}
          </h3>
          <div className="flex justify-center items-center mt-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`h-6 w-6 ${
                  star <= calculateAverageRating(sitter.reviews)
                    ? 'text-yellow-500'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <Link
            className="mt-6 block text-center bg-gradient-to-r from-purple-600 to-indigo-500 text-white py-3 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-shadow shadow-lg"
            to={`/sitter/profile/${sitter.UserSid}/${sitter._id}`}
          >
            View Profile
          </Link>
          {showClosest && (
            <p className="text-center text-sm text-indigo-600 mt-3">
              Distance: {sitter.distance?.toFixed(2)} km
            </p>
          )}
          <p className="text-center mt-2 text-sm font-light">{address[sitter._id]}</p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => navigate('/booklist')}
              className="px-6 py-2 bg-indigo-500 text-white rounded-full shadow-md hover:bg-indigo-600 transition-transform transform hover:scale-105"
            >
              Book Now
            </button>
            <button
              onClick={() => toggleFavourite(sitter)}
              className="flex items-center justify-center px-6 py-2 rounded-full transition-transform transform hover:scale-105 bg-gray-100 hover:bg-gray-200 shadow-md"
            >
              {favourites.some((fav) => fav._id === sitter._id) ? (
                <AiFillHeart className="text-red-500 text-2xl" />
              ) : (
                <AiOutlineHeart className="text-gray-400 text-2xl" />
              )}
              <span className="ml-2">
                {favourites.some((fav) => fav._id === sitter._id)
                  ? 'Liked'
                  : 'Like'}
              </span>
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
</div>
  </>
  );
};

export default SitterDetails;



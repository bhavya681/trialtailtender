// import React, { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';
// import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

// const SitterDetails = () => {
//   const [sitters, setSitters] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [address, setAddress] = useState({});
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [showClosest, setShowClosest] = useState(false);
//   const [favourites, setFavourites] = useState([]);

//   useEffect(() => {
//     const savedStuff = JSON.parse(localStorage.getItem('favourites')) || [];
//     setFavourites(savedStuff);
//   }, []);

//   const saveFavourites = (fav) => {
//     setFavourites(fav);
//     localStorage.setItem('favourites', JSON.stringify(fav));
//   };

//   const toggleFavourite = (sitter) => {
//     const savedStuff = favourites.some((fav) => fav._id === sitter._id) ? favourites.filter((fav) => fav._id !== sitter._id) : [...favourites, sitter];
//     saveFavourites(savedStuff);
//     toast.success(favourites.some((fav) => fav._id === sitter._id) ? 'Removed to Favourites' : 'Added from Favourites');
//   }

//   const navigate = useNavigate();
//   // Fetch all sitters
//   const fetchAllSitters = async () => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/sitters/all`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       const data = await res.json();
//       if (data.success) setSitters(data.sitters);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // Fetch user's current location
//   const fetchUserLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setCurrentLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//           toast.success('Location detected successfully!');
//         },
//         () => toast.error('Failed to get location')
//       );
//     } else {
//       toast.error('Geolocation is not supported by this browser.');
//     }
//   };

//   // Calculate distance between two coordinates
//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Earth radius in km
//     const dLat = ((lat2 - lat1) * Math.PI) / 180;
//     const dLon = ((lon2 - lon1) * Math.PI) / 180;
//     const a =
//       Math.sin(dLat / 2) ** 2 +
//       Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLon / 2) ** 2;
//     return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
//   };

//   // Fetch all sitters on mount
//   useEffect(() => {
//     fetchAllSitters();
//     fetchUserLocation();
//   }, []);

//   // Get address from coordinates
//   const getAddressFromCoordinates = async (latitude, longitude) => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
//       );
//       if (!response.ok) throw new Error('Failed to fetch location');
//       const data = await response.json();
//       return data.display_name || 'Unknown Location';
//     } catch (error) {
//       console.error('Error fetching address:', error);
//       return 'Unknown Location';
//     }
//   };

//   // Fetch addresses for sitters
//   useEffect(() => {
//     const fetchAddresses = async () => {
//       const newAddresses = {};
//       for (const sitter of sitters) {
//         if (sitter.location?.coordinates) {
//           const [lon, lat] = sitter.location.coordinates;
//           const addr = await getAddressFromCoordinates(lat, lon);
//           newAddresses[sitter._id] = addr;
//         }
//       }
//       setAddress(newAddresses);
//     };
//     if (sitters.length) fetchAddresses();
//   }, [sitters]);

//   // Get closest sitters
//   const closestSitters = sitters
//     .map((sitter) => {
//       const [lon, lat] = sitter.location?.coordinates || [];
//       return {
//         ...sitter,
//         distance: currentLocation
//           ? calculateDistance(currentLocation.latitude, currentLocation.longitude, lat, lon)
//           : null,
//       };
//     })
//     .filter((sitter) => sitter.distance !== null)
//     .sort((a, b) => a.distance - b.distance)
//     .slice(0, 5);

//   // Filter sitters based on search term, filters, or show closest
//   const filteredSitters = (showClosest ? closestSitters : sitters).filter((sitter) =>
//     sitter.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="max-w-7xl mt-10 mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-100 via-white to-purple-100">
//       <section className="rounded-3xl shadow-2xl bg-white/80 backdrop-blur-sm p-8">
//         <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-8">
//           Find Your Perfect Sitter
//         </h2>

//         {/* Search and Buttons */}
//         <div className="flex justify-between items-center mb-8">
//           <input
//             type="text"
//             placeholder="Search by name"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm w-full max-w-md"
//           />
//           <div className="flex gap-4 ml-4">
//             <button
//               onClick={() => setShowClosest(true)}
//               className="px-6 py-3 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition"
//             >
//               Show Closest Sitters
//             </button>
//             <button
//               onClick={() => setShowClosest(false)}
//               className="px-6 py-3 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition"
//             >
//               Show All Sitters
//             </button>
//           </div>
//         </div>

//         {/* Sitters */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {filteredSitters.map((sitter) => (
//             <div
//               key={sitter._id}
//               className="bg-white rounded-xl shadow-gray-500 shadow-lg p-6 hover:shadow-2xl transition"
//             >
//               <img
//                 src={sitter.profile || '/placeholder.svg'}
//                 alt={sitter.name}
//                 className="w-32 h-32 object-cover rounded-full mx-auto"
//               />
//               <h3 className="text-xl font-bold text-center mt-4">{sitter.name}</h3>

//               <h3 className="text-xl font-bold text-center mt-4">{sitter?.reviews.map((review)=>(<>
//               <span>{review?.rating}</span>
//               </>))}</h3>

//               <p className="text-center text-gray-500">{address[sitter._id]}</p>
//               {showClosest && (
//                 <p className="text-center text-sm text-indigo-600 mt-2">
//                   Distance: {sitter.distance?.toFixed(2)} km
//                 </p>
//               )}
//               <div className="mt-4 flex justify-center gap-2">
//                 <button
//                   onClick={() => navigate('/booklist')}
//                   className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
//                 >
//                   Book Now
//                 </button>

//                 <button
//                   onClick={() => toggleFavourite(sitter)}
//                   className="flex items-center justify-center px-4 py-2 rounded-lg transition relative group"
//                 >
//                   {favourites.some((fav) => fav._id === sitter._id) ? (
//                     <AiFillHeart
//                       className="text-red-500 text-2xl transform scale-100 transition-transform duration-300 group-hover:scale-110"
//                     />
//                   ) : (
//                     <AiOutlineHeart
//                       className="text-gray-400 text-2xl transform scale-100 transition-transform duration-300 group-hover:scale-110"
//                     />
//                   )}
//                   <span
//                     className="ml-2 text-sm font-medium transition-colors duration-300 group-hover:text-indigo-600"
//                   >
//                     {favourites.some((fav) => fav._id === sitter._id) ? "Liked" : "Like"}
//                   </span>
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default SitterDetails;


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
  const [ratingFilter, setRatingFilter] = useState(0); // New state for rating filter

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
      const res = await fetch(`http://localhost:5000/api/sitters/all`, {
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
    <div className="max-w-7xl mt-10 mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <section className="rounded-3xl shadow-2xl bg-white/80 backdrop-blur-sm p-8">
        <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-8">
          Find Your Perfect Sitter
        </h2>

        {/* Search and Filters */}
        <div className="flex justify-between items-center mb-8">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm w-full max-w-md"
          />
          <div className="flex gap-4 ml-4">
            <button
              onClick={() => setShowClosest(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition"
            >
              Show Closest Sitters
            </button>
            <button
              onClick={() => setShowClosest(false)}
              className="px-6 py-3 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition"
            >
              Show All Sitters
            </button>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="mb-8">
          <label htmlFor="ratingFilter" className="block text-sm font-medium text-gray-700">Filter by Rating:</label>
          <select
            id="ratingFilter"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
            <div key={sitter._id} className="bg-white rounded-xl shadow-gray-500 shadow-lg p-6 hover:shadow-2xl transition">
              <img src={sitter.profile || '/placeholder.svg'} alt={sitter.name} className="w-32 h-32 object-cover rounded-full mx-auto" />
              <h3 className="text-xl font-bold text-center mt-4">{sitter.name}</h3>

              {/* Average Rating Display */}
              <h3 className="text-xl font-bold text-center mt-4">
                Average Rating:
                <span className="flex justify-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className={`h-6 w-6 ${star <= calculateAverageRating(sitter.reviews) ? 'text-yellow-500' : 'text-gray-300'}`} />
                  ))}
                </span>
              </h3>
              <Link
                className="bg-gradient-to-r from-purple-500 to-blue-500 my-4 text-white p-2 rounded-lg flex justify-center items-center text-center 
             hover:from-blue-500 hover:to-purple-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-blue-500/50"
                to={`/sitter/profile/${sitter.UserSid}/${sitter._id}`}
              >
                View Profile
              </Link>
              <p className="text-center text-gray-500">{address[sitter._id]}</p>
              {showClosest && (
                <p className="text-center text-sm text-indigo-600 mt-2">
                  Distance: {sitter.distance?.toFixed(2)} km
                </p>
              )}
              <h1 className='text-center items-center font-mono'>{address[sitter._id] ? address[sitter._id] : 'Location'}</h1>
              <div className="mt-4 flex justify-center gap-2">
                <button onClick={() => navigate('/booklist')} className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">
                  Book Now
                </button>

                <button onClick={() => toggleFavourite(sitter)} className="flex items-center justify-center px-4 py-2 rounded-lg transition relative group">
                  {favourites.some((fav) => fav._id === sitter._id) ? (
                    <AiFillHeart className="text-red-500 text-2xl transform scale-100 transition-transform duration-300 group-hover:scale-110" />
                  ) : (
                    <AiOutlineHeart className="text-gray-400 text-2xl transform scale-100 transition-transform duration-300 group-hover:scale-110" />
                  )}
                  <span className="ml-2 text-sm font-medium transition-colors duration-300 group-hover:text-indigo-600">
                    {favourites.some((fav) => fav._id === sitter._id) ? "Liked" : "Like"}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SitterDetails;



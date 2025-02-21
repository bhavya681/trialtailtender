import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiCard } from "react-icons/bi";
import { Link } from "react-router-dom";

const ProfessionalProfile = () => {

  const [bookings, setBookings] = useState([]);
  const [newId, setNewId] = useState('');
  const userName = localStorage.getItem('userName');
  const [address, setAddress] = useState({});
  const [reviews, setReviews] = useState([]);
  const role = localStorage.getItem('user');

  useEffect(() => {
    const fetchSitters = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sitters`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          const sitters = data?.sitters || [];
          const matchingSitter = sitters?.find((sitter) => sitter?.name === userName);
          if (matchingSitter) {
            setNewId(matchingSitter?._id);

          }
        }
      } catch (error) {
        console.error('Error fetching sitters:', error);
      }
    };

    fetchSitters();
  }, [userName]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!newId) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/bookings/sitter/${newId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setBookings(data.bookings);
          setReviews(data.bookings.sitter.reviews);

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


  const [sitters, setSitters] = useState([]);

  const fetchAllStuff = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sitters/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setSitters(data.sitters);

      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllStuff();
  }, []);

  const [pets, setPets] = useState([]);

  const fetchPets = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pets`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setPets(data.pets);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (role === 'owner') {
      fetchPets();
    }
  }, []);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            'User-Agent': 'YourAppName/1.0 (your.email@example.com)',
            'Accept-Language': 'en',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch location');
      }

      const data = await response.json();
      const address = data.display_name || 'Unknown Location';

      // Split and extract address parts
      const addressParts = address.split(',').map(part => part.trim());
      const street = addressParts[0] || 'Unknown Street';
      const city = addressParts[1] || 'Unknown City';
      const state = addressParts[2] || 'Unknown State';
      const country = addressParts[addressParts.length - 1] || 'Unknown Country';

      return { street, city, state, country };
    } catch (error) {
      console.error('Error fetching address:', error);
      return { street: 'Unknown Street', city: 'Unknown City', state: 'Unknown State', country: 'Unknown Country' };
    }
  };

  useEffect(() => {
    if (profile?.location?.coordinates) {
      const [longitude, latitude] = profile.location.coordinates;
      getAddressFromCoordinates(latitude, longitude).then((location) => {
        const { street, city, state, country } = location;
        setAddress({ street: street, city: city, state: state, country: country });
      });
    }
  }, [profile]);

  const RatingStars = ({ rating }) => {
    const roundedRating = Math.round(rating); // Round rating for full stars
    return (
      <div className="flex text-yellow-500">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < roundedRating ? "text-yellow-500" : "text-gray-300"}>
            ★
          </span>
        ))}
      </div>
    );
  };

  // Fetch user profile from the backend
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setProfile(data.user);
      } else {
        toast.error(data.message || "Failed to fetch profile.");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching profile.");
    } finally {
      setLoading(false);
    }
  };

  // Delete profile
  const deleteProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/delete-profile`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        toast.success("Profile deleted successfully!");
        setProfile(null);
        console.log(profile);
      } else {
        toast.error(data.message || "Failed to delete profile.");
      }
    } catch (error) {
      toast.error(error.message || "Error deleting profile.");
    }
  };
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;
  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Profile not found. Please try again later.</p>
      </div>
    );
  }
  const animalImages = {
    Dog: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS3O5xH6IrQLYXrnMUOcjugrOWsypu_ucaUmZFmZUWyzu2KM-cESu7N35IgEHdb9l7aMSQF2rAuqlIbUB88m_IKyTXjI78lsi6zIpDz6j8",
    Cat: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRMCW_fU5dEw7p-izIGoy8V0a1ESPwVtQuOA&s",
    Bird: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-LH8XefpZPlQnTj8XQ8taD5mjlnT7LxDk0w&s",
    Rabbit: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTeNKIQGiMx4GEleY3KvVm29TWRx8vqa1TvQ&s",
    Hamster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS1-3nz_YNvbGOViHC_NRNcUeLmCtGgyPcmg&s",
    Fish: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrNj9t_mLDFZv1TxaTBtDvhxSc4CP2YiKOWQ&s",
    Reptiles: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjkePONVrGxFE8cDM_Iw-T8bKrGnIyUF87zw&s",
    Other: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTGuSpDgPnNlzCccWB02yVfUF3WfKHXuINyQ&s",
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Banner Section */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={
            "https://images.unsplash.com/photo-1629846735951-4d0512b27d77?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt="Banner"
          className="w-full h-full object-cover transform scale-105 hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent"></div>
      </div>

      {/* Profile Card */}
      <div className="relative -mt-32 mx-auto w-full max-w-4xl">
        <div className="backdrop-blur-xl bg-white/80 p-8 rounded-3xl shadow-2xl border border-white/20">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Image with Animated Border */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-full opacity-75 group-hover:opacity-100 blur animate-gradient-xy"></div>
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white">
                <img
                  src={profile?.profile}
                  alt="User Avatar"
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Profile Details with Modern Typography and Layout */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {profile?.name}
              </h1>


              <div className="mt-5 flex flex-wrap gap-4 justify-center md:justify-start items-center">
                <span className="px-5 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-md transition-transform transform hover:scale-105 capitalize">
                  {profile.role || "N/A"}
                </span>
                <span className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-500 via-yellow-500 to-yellow-600 text-white shadow-md transition-transform transform hover:scale-105">
                  {profile.bio || "N/A"}
                </span>
                <span className="px-5 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white shadow-md transition-transform transform hover:scale-105">
                  {address.city}, {address.country}
                </span>
              </div>
              <div className="mt-4 ">
                <h2 className="text-xl font-medium text-gray-800">Location📍</h2>
                <div className="flex flex-col space-y-2 mt-2 justify-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">Street:</span>
                    <span className="text-sm text-gray-900">{address.street}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">City:</span>
                    <span className="text-sm text-gray-900">{address.city}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">State:</span>
                    <span className="text-sm text-gray-900">{address.state}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">Country:</span>
                    <span className="text-sm text-gray-900">{address.country}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                <a
                  href={`mailto:${profile.email}`}
                  className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="group-hover:underline">{profile.email}</span>
                </a>
                <span className="hidden sm:block text-gray-300">|</span>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{profile?.phone || "+91 93292939203"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-end">

            <button
              onClick={deleteProfile}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Delete Profile
            </button>
            <Link
              to={`/editprofile/${profile._id}`}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-semibold shadow-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="mt-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Section */}
        <div className="bg-white p-6 shadow-md rounded-xl">
          <h2 className="text-xl font-bold text-gray-800">Introduction</h2>
          <p className="mt-3 text-gray-600">
            {profile.bio || "This user has not provided a bio. Stay tuned for more updates!"}
          </p>
          <div className="mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">
              Watch Video
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-white p-6 shadow-md rounded-xl">
          <h2 className="text-xl font-bold text-gray-800"><Link to={'/reviews'}>Feedback</Link></h2>
          <p className="mt-3 text-gray-600">
            Get great feedback and learn how users feel about your services.
          </p>
          <div className="mt-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition">
              View Feedback
            </button>
          </div>
        </div>
      </div>
      {/* Experience/History Section */}
      <div className="mt-10 max-w-6xl mx-auto bg-white p-6 shadow-md rounded-xl">

        <div className="mt-4">
          {profile.role === "sitter" ? (
            <ul className="space-y-4">
              <div className="max-w-7xl mx-auto p-4 md:p-6">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 text-center">
                  Your Booking History
                </h2>
                {bookings.length > 0 ? (
                  <div className="overflow-hidden rounded-2xl shadow-2xl bg-white border border-gray-100">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                          <tr>
                            {['Owner', 'Pet Details', 'Service', 'Timeline', 'Status', 'User  Ratings and Review', 'Reviews Date', 'Actions'].map((header) => (
                              <th key={header} className="py-4 px-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {bookings.map((booking) => (
                            <tr
                              key={booking._id}
                              className={`hover:bg-gray-50 transition-colors duration-200 ${booking.status === 'completed' ? 'bg-gray-50' : ''}`}
                            >
                              <td className="py-4 px-4">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0">
                                    <img
                                      className="h-full w-full rounded-full bg-gradient-to-r from-blue-400 to-purple-400 object-cover transform hover:scale-110 transition-transform duration-500 cursor-pointer"
                                      alt="owner profile"
                                      src={booking?.owner?.profile}
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{booking.owner.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="text-sm text-gray-900">
                                  {booking.pets.map((pet, index) => (
                                    <div key={index} className="mb-1">
                                      <span className="font-medium">{pet?.name}</span>
                                      <span className="text-gray-500"> ({pet.type})</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {booking.serviceType}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="text-sm text-gray-900">
                                  <div className="mb-1">
                                    <span className="font-medium">Start:</span>
                                    <div className="text-gray-500">
                                      {new Date(booking.startDate).toLocaleDateString()}
                                      <br />
                                      {new Date(booking.startDate).toLocaleTimeString()}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="font-medium">End:</span>
                                    <div className="text-gray-500">
                                      {new Date(booking.endDate).toLocaleDateString()}
                                      <br />
                                      {new Date(booking.endDate).toLocaleTimeString()}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${booking.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                  {booking.status}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex flex-col justify-center items-center">
                                  {booking.sitter?.reviews.map((star) => {
                                    if (star?.ownerId === booking?.owner?._id) {
                                      return (
                                        <div key={star?._id} className="border-b border-gray-200 pb-4 mb-4 w-full">
                                          <div className="flex items-center justify-between">
                                            <RatingStars rating={star?.rating} />
                                          </div>
                                          <p className="text-gray-600 mt-2">{star?.comment}</p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex flex-col items-center">
                                  {booking.sitter?.reviews.map((star) => {
                                    if (star?.ownerId === booking?.owner?._id) {
                                      return (
                                        <div key={star?._id} className="border-b border-gray-200 pb-4 mb-4 w-full">
                                          <span className="text-gray-500 text-sm">{new Date(star.createdAt).toLocaleDateString()}</span>
                                        </div>
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex flex-col space-y-2">
                                  <Link
                                    to={`/edit-status/${booking._id}`}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 transition"
                                  >
                                    Edit Status
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="mt-4 text-lg text-gray-600">No bookings assigned to you yet.</p>
                    <p className="mt-2 text-sm text-gray-500">New bookings will appear here when clients book your services.</p>
                  </div>
                )}
              </div>
            </ul>
          ) : profile.role === "owner" ? (
            <>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 text-center mb-3">
                {profile.role === "sitter" ? "Work Experience" : profile.role === "breeder" ? "My Breeds" : "My Pets"}
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {pets && pets.length > 0 ? (
                  pets.map((pet, index) => (
                    <li
                      key={index}
                      className="relative group bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="p-6 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">
                              {pet?.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full">
                                {pet.breed}
                              </span>
                              <span className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full">
                                {pet.age} years
                              </span>
                            </div>
                          </div>
                          <div className="relative">
                            <img
                              className="h-16 w-16 rounded-full object-cover ring-4 ring-indigo-50 transform group-hover:scale-110 transition-transform duration-300"
                              src={pet.pic}
                              alt={pet?.name}
                            />
                            <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="col-span-full">
                    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-md">
                      <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4M12 4v16" />
                      </svg>
                      <p className="text-lg font-medium text-gray-600">No pets added yet</p>
                      <p className="text-sm text-gray-500 mt-2">Add your first pet to get started</p>
                    </div>
                  </li>
                )}
              </ul>
            </>) : (
            <>
    <div className="mt-10 max-w-6xl mx-auto bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-lg p-8 shadow-2xl rounded-3xl border border-white/20 transform transition-all duration-500 hover:shadow-3xl">
  <h2 className="text-4xl sm:text-5xl text-center font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-10 animate-gradient">
    {profile.role === "breeder" ? "About My Work" : "My Profile"}
  </h2>

  {profile.role === "breeder" && (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Breeds Section */}
      {profile.breeds && profile.breeds.length > 0 ? (
        profile.breeds.map((breed, index) => (
          <div
          key={index}
          className="group bg-gradient-to-br from-white via-white to-indigo-50 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-indigo-50/50 overflow-hidden"
        >
          <div className="p-7">
            {/* Animal Type and Breed */}
            <h3 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
              <span className="p-2 bg-indigo-100 rounded-xl mr-3">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg flex items-center space-x-2 rounded-[80%]">
  {animalImages[breed.animalType] && (
    <img
      src={animalImages[breed.animalType]}
      alt={breed.animalType}
      className="w-10 h-10 rounded-full"
    />
  )}
 
</div>
              </span>
              {breed.animalType}: {breed.breed}
            </h3>
        
            {/* Minimalist Design with Hover Effects */}
            <div className="space-y-4">
              {/* Animal Type */}
              <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-2xl hover:bg-indigo-50/50 transition-colors duration-300">
                <span className="text-gray-700 font-semibold">
                  Animal Type
                </span>
                <span className="px-4 py-1.5 bg-purple-100/80 text-purple-800 rounded-full text-sm font-bold tracking-wide">
                  {breed.animalType}
                </span>
              </div>
        
              {/* Breed */}
              <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-2xl hover:bg-indigo-50/50 transition-colors duration-300">
                <span className="text-gray-700 font-semibold">
                  Breed
                </span>
                <span className="px-4 py-1.5 bg-pink-100/80 text-pink-800 rounded-full text-sm font-bold tracking-wide">
                  {breed.breed}
                </span>
              </div>
            </div>
          </div>
        </div>
        ))
      ) : (
        <p className="text-center col-span-full text-gray-600">
          No breeds available.
        </p>
      )}

      {/* Breeding Statistics */}
      <div className="col-span-full bg-gradient-to-br from-white via-white to-gray-50 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 border border-gray-100/50">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
          <span className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl mr-3">
            📊
          </span>
          Breeding Statistics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="group bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30 p-8 rounded-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-lg">
            <p className="text-4xl font-bold text-blue-800 mb-2 group-hover:scale-110 transition-transform">
              {profile.statistics.successfulBreeds}+
            </p>
            <p className="text-sm font-semibold text-blue-600/90">
              Successful Breeds
            </p>
          </div>
          <div className="group bg-gradient-to-br from-purple-50 via-purple-100/50 to-purple-200/30 p-8 rounded-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-lg">
            <p className="text-4xl font-bold text-purple-800 mb-2 group-hover:scale-110 transition-transform">
              {profile.statistics.yearsExperience}+
            </p>
            <p className="text-sm font-semibold text-purple-600/90">
              Years Experience
            </p>
          </div>
          <div className="group bg-gradient-to-br from-green-50 via-green-100/50 to-green-200/30 p-8 rounded-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-lg">
            <p className="text-4xl font-bold text-green-800 mb-2 group-hover:scale-110 transition-transform">
              {profile.statistics.customerSatisfaction}%
            </p>
            <p className="text-sm font-semibold text-green-600/90">
              Customer Satisfaction
            </p>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Portfolio Section */}
  <div className="mt-8 bg-gradient-to-br from-white via-white to-gray-50 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 border border-gray-100/50">
    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
      <span className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl mr-3">
        <BiCard/>
      </span>
Business Card
    </h3>
    {profile.portfolio ? (
      <div className="mt-2 border rounded-lg overflow-hidden shadow-sm transform transition-all duration-500 hover:scale-105">
        <a href={profile.portfolio} target="_blank" rel="noopener noreferrer">
          <img
            src={profile.portfolio}
            alt="Breeder Portfolio"
            className="w-full h-48 object-cover transition-transform transform hover:scale-110"
          />
        </a>
      </div>
    ) : (
      <p className="text-sm text-gray-500">No portfolio available.</p>
    )}
  </div>
</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;

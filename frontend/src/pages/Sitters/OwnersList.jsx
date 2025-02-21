import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const OwnersList = () => {
  const [owners, setOwners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: '', sortBy: 'name' });
  const [showFilters, setShowFilters] = useState(false);
  const [addresses, setAddresses] = useState({});
  const [closestOwners, setClosestOwners] = useState([]);
  const currentLocation = { latitude: 37.7749, longitude: -122.4194 }; // Example coordinates

  const fetchOwners = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/owners-list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        const ownerUsers = data.user.filter((u) => u.role === 'owner');
        setOwners(ownerUsers);
      }
    } catch (error) {
      console.error('Error fetching owners:', error);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

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

      if (!response.ok) throw new Error('Failed to fetch location');

      const data = await response.json();
      return data.display_name || 'Unknown Location';
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Unknown Location';
    }
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      const newAddresses = {};
      for (const owner of owners) {
        if (owner.location && owner.location.coordinates) {
          const [longitude, latitude] = owner.location.coordinates;
          const address = await getAddressFromCoordinates(latitude, longitude);
          newAddresses[owner._id] = address;
        }
      }
      setAddresses(newAddresses);
    };

    if (owners.length > 0) fetchAddresses();
  }, [owners]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const filteredOwners = owners.filter(owner => {
    const matchesSearch =
      owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filters.status || owner.status === filters.status;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const showClosestSitters = () => {
    const sortedOwners = [...owners].sort((a, b) => {
      if (a.location && b.location) {
        const [lonA, latA] = a.location.coordinates;
        const [lonB, latB] = b.location.coordinates;
        return calculateDistance(currentLocation.latitude, currentLocation.longitude, latA, lonA) -
          calculateDistance(currentLocation.latitude, currentLocation.longitude, latB, lonB);
      }
      return 0;
    });

    setClosestOwners(sortedOwners);
    setFilters({ status: '', sortBy: 'name' });
    setSearchTerm('');
  };

  const showAllOwners = () => {
    setSearchTerm('');
    setFilters({ status: '', sortBy: 'name' });
    setClosestOwners([]);
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 mt-14 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-gradient-x">
          Pet Owners Directory
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto font-light">
          Connect with pet owners in your area and provide the best care for their beloved companions.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4 backdrop-blur-lg bg-white/30 p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={20} />
            <input
              type="text"
              placeholder="Search owners by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80"
            />
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl hover:bg-gray-50 transition duration-300 shadow-sm hover:shadow-md"
            >
              <Filter size={20} className="text-blue-500" />
              Filters
            </button>
            <button
              onClick={showClosestSitters}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Show Closest
            </button>
            <button
              onClick={showAllOwners}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Show All
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="p-6 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg space-y-4 mt-4 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                >
                  <option value="name">Name</option>
                  <option value="recent">Most Recent</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {closestOwners.length === 0 && filteredOwners.length === 0 ? (
        <div className="text-center p-12 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg">
          <p className="text-gray-500 text-xl font-light">No pet owners found at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(closestOwners.length > 0 ? closestOwners : filteredOwners).map((owner) => (
            <div key={owner._id} className="group bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
              <div className="relative p-6">
                {owner.status === "active" && (
                  <span className="absolute top-4 right-4 bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">Active</span>
                )}
                <div className="flex flex-col items-center">
                  <img src={owner?.profile} alt={owner?.name} className="w-24 h-24 rounded-full ring-4 ring-blue-100 mb-4 object-cover" />
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{owner.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{owner.email}</p>
                  <p className="text-gray-600 text-xs text-center mb-6 line-clamp-2" title={addresses[owner._id]}>
                    {addresses[owner._id]}
                  </p>
                  <Link
                    to={`/message/${owner._id}`}
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Connect
                  </Link>
                </div>
              </div>
              <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnersList;

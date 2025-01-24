import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Search, Filter } from 'lucide-react';

const OwnersList = () => {
  const [owners, setOwners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: '', sortBy: 'name' });
  const [showFilters, setShowFilters] = useState(false);
  const [addresses, setAddresses] = useState({});
  const [closestOwners, setClosestOwners] = useState([]); // Store closest owners
  const currentLocation = { latitude: 37.7749, longitude: -122.4194 }; // Example SF coordinates

  const fetchOwners = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/owners-list', {
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
      console.log(error);
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

  // Function to calculate distance between two coordinates using Haversine formula
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

  // Function to filter owners based on search term and status
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

  // Function to show closest sitters
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

    setClosestOwners(sortedOwners); // Set closest owners
    setFilters({ status: '', sortBy: 'name' }); // Reset filters
    setSearchTerm(''); // Clear search term
  };

  // Function to show all owners
  const showAllOwners = () => {
    setSearchTerm('');
    setFilters({ status: '', sortBy: 'name' });
    setClosestOwners([]); // Clear closest owners
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 mt-14 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          Pet Owners Directory
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with pet owners in your area and provide the best care for their beloved companions.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search owners by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <Filter size={20} />
            Filters
          </button>
          {/* Show Closest Sitters Button */}
          <button
            onClick={showClosestSitters}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Show Closest Sitters
          </button>
          {/* Show All Button */}
          <button
            onClick={showAllOwners}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
          >
            Show All
          </button>
        </div>

        {showFilters && (
          <div className="p-4 bg-white rounded-lg shadow-md space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-[5px]">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full p-[10px] border border-gray-[300] rounded-lg focus:ring-[2px] focus:ring-blue-[500] focus:border-transparent"
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
        <div className="text-center  shadow-gray-800  py-[20px] bg-gray-[50] rounded-[20px]">
          <div className="animate-pulse">
            <div className="h-[24px] w-[24px] bg-gray-[200] rounded-full mx-auto mb-[15px]" />
            <p className="text-gray-[500] text-lg">No pet owners found at the moment.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-[20px]">
          {(closestOwners.length > 0 ? closestOwners : filteredOwners).map((owner) => (
            <div key={owner._id} className="group  shadow-gray-300  relative bg-white rounded-[20px] p-[15px] shadow-md hover:shadow-xl transform hover:-translate-y-[1px] transition-all duration-[300ms]">
              {owner.status === "active" && (
                <div className="absolute top-[10px] right-[10px]">
                  <span className="bg-green-[50] text-green-[600] px-[10px] py-[5px] rounded-full text-xs font-medium">Active</span>
                </div>
              )}

              {/* Owner Details */}
              <div className="flex flex-col items-center">
                <img src={owner?.profile} alt={owner?.name} className='w-[80px] h-[80px] rounded-full mb-[15px]' />
                <h3 className="text-xl font-bold text-gray-900 mb-[5px]">{owner.name}</h3>
                <p className="text-gray-500 text-sm mb-[5px]">{owner.email}</p>

                {/* Address Display */}
                <div className="relative">
                  <h1 className="text-gray-600 text-xs text-center mb-[10px] max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap" title={addresses[owner._id]}>
                    {addresses[owner._id]}
                  </h1>
                  {/* Optional Tooltip for Full Address */}
                  <div className="absolute inset-0 mb-9 flex items-center justify-center">
                    <span className="hidden group-hover:block bg-gray-900 text-white text-xs rounded-md p-1">
                      {addresses[owner._id]}
                    </span>
                  </div>
                </div>

                {/* Connect Button */}
                <button
                  onClick={() => toast(`Contact ${owner.name}`)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-[15px] py-[10px] rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-[300ms]"
                >
                  Connect
                </button>
              </div>



              {/* Gradient Bottom Line */}
              <div className="absolute bottom-[0px] left-[0px] right-[0px] h-[3px] bg-gradient-to-r from-blue-[600] to-indigo-[600] rounded-b-[10px]" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnersList;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircleCodeIcon, Search } from 'lucide-react';

const SitterChats = () => {
    const [sitters, setSitters] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchSitters = async () => {
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
            console.error('Error fetching sitters:', error);
        }
    };

    useEffect(() => {
        fetchSitters();
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

    const filteredSitters = sitters.filter(sitter =>
        sitter.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 mt-[58px] min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Search Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-10 p-4 rounded-2xl shadow-sm mb-8">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search sitters..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Chats List */}
            <div className="space-y-3">
                {filteredSitters.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl shadow-sm">
                        <div className="w-16 h-16 mb-4 text-gray-300">
                            <MessageCircleCodeIcon size={64} />
                        </div>
                        <p className="text-gray-500 font-medium">No sitters found</p>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
                    </div>
                ) : (
                    filteredSitters.map((sitter) => (
                        <Link
                            key={sitter._id}
                            to={`/message/${sitter.UserSid}`}
                            className="block group"
                        >
                            <div className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-100">
                                <div className="flex items-center space-x-4">
                                    {/* Profile Image */}
                                    <div className="relative">
                                        <img
                                            className="h-14 w-14 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-blue-100 transition-all duration-200"
                                            src={sitter.profile || 'https://via.placeholder.com/100'}
                                            alt={sitter.name}
                                        />
                                        {sitter.status === 'active' && (
                                            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                                        )}
                                    </div>

                                    {/* Sitter Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                                {sitter.name}
                                            </h3>
                                            {sitter.status === 'active' ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 group-hover:text-blue-500 transition-colors duration-200">
                                                    <MessageCircleCodeIcon size={20} />
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500 truncate">
                                            {sitter.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default SitterChats;

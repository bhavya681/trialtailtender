import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircleCodeIcon, Search } from 'lucide-react';

const OwnersChats = () => {
    const [owners, setOwners] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredOwners = owners.filter(owner =>
        owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 mt-[58px] min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Search Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-10 p-4 rounded-2xl shadow-sm mb-8">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Chats List */}
            <div className="space-y-3">
                {filteredOwners.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl shadow-sm">
                        <div className="w-16 h-16 mb-4 text-gray-300">
                            <MessageCircleCodeIcon size={64} />
                        </div>
                        <p className="text-gray-500 font-medium">No chats found</p>
                    </div>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
                        {filteredOwners.map((owner) => (
                            <Link
                                key={owner._id}
                                to={`/message/${owner._id}`}
                                className="group bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-100"
                            >
                                <div className="flex items-center space-x-4">
                                    {/* Profile Image */}
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={owner.profile || 'https://via.placeholder.com/40'}
                                            alt={owner.name}
                                            className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-blue-100 transition-all duration-300"
                                        />
                                        {owner.status === "active" && (
                                            <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                                        )}
                                    </div>

                                    {/* Chat Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-gray-900 truncate">{owner.name}</h3>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <MessageCircleCodeIcon size={18} />
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 truncate">
                                            {owner.email || 'Start a conversation'}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OwnersChats;

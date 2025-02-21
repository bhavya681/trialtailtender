import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChartAreaIcon, Search, MessageCircle } from 'lucide-react';
import { AiFillProfile, AiOutlineProfile, AiTwotoneProfile } from 'react-icons/ai';
import { motion } from 'framer-motion';

const BreedersList = () => {
    const [breeders, setBreeders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [filteredBreeders, setFilteredBreeders] = useState([]);

    useEffect(() => {
        const fetchBreeders = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/breeders-list`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                setBreeders(data.breeders);
                setFilteredBreeders(data.breeders);
            } catch (error) {
                console.error('Error fetching breeders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBreeders();
    }, []);

    useEffect(() => {
        const filtered = breeders.filter(breeder =>
            breeder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            breeder.address?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBreeders(filtered);
    }, [searchTerm, breeders]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-[56px] bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:items-center md:justify-between mb-8 md:mb-12">
                    <motion.h2 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                    >
                        Find Your Perfect Breeder
                    </motion.h2>
                    
                    <motion.div 
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="relative w-full md:w-96"
                    >
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search by name or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Grid Section */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8"
                >
                    {filteredBreeders.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-xl text-gray-600">No breeders found matching your search.</p>
                        </div>
                    ) : (
                        filteredBreeders.map((breeder) => (
                            <motion.div
                                key={breeder._id}
                                variants={itemVariants}
                                className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="relative overflow-hidden">
                                    <div className="aspect-w-16 aspect-h-12">
                                        <img
                                            src={breeder.profile}
                                            alt={breeder.name}
                                            className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                
                                <div className="p-6 space-y-4">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                        {breeder.name}
                                    </h3>
                                    <p className="text-gray-600 line-clamp-2">{breeder.address}</p>
                                    
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Link 
                                            to={`/breedersProfile/${breeder._id}`} 
                                            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300 gap-2"
                                        >
                                            <AiTwotoneProfile className="w-5 h-5" />
                                            <span>Profile</span>
                                        </Link>
                                        <Link 
                                            to={`/message/${breeder._id}`} 
                                            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-[1.02] transition-all duration-300 gap-2"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                            <span>Message</span>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default BreedersList;

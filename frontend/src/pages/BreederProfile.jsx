import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ChartAreaIcon, ChartBar, ChartBarBig, MessageCircle } from 'lucide-react';
import { BiCard } from 'react-icons/bi';

const BreederProfile = () => {
    const { breederId } = useParams();
    const [breeder, setBreeder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        country: ''
    });

    useEffect(() => {
        const fetchBreederProfile = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/breeders-profile/${breederId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!res.ok) {
                    throw new Error(`Error: ${res.status} ${res.statusText}`);
                }

                const data = await res.json();
                setBreeder(data.breeder);
                console.log(data.breeder);
            } catch (error) {
                console.error('Error fetching breeder profile:', error);
                toast.error('Failed to fetch breeder profile');
            } finally {
                setLoading(false);
            }
        };

        fetchBreederProfile();
    }, [breederId]);

    const getAddressFromCoordinates = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
                {
                    headers: {
                        'User-Agent': 'PetCare/1.0',
                        'Accept-Language': 'en',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch location');
            }

            const data = await response.json();
            return {
                street: data.address.road || 'Unknown Street',
                city: data.address.city || data.address.town || 'Unknown City',
                state: data.address.state || 'Unknown State',
                country: data.address.country || 'Unknown Country'
            };
        } catch (error) {
            console.error('Error fetching address:', error);
            return {
                street: 'Unknown Street',
                city: 'Unknown City',
                state: 'Unknown State',
                country: 'Unknown Country'
            };
        }
    };

    useEffect(() => {
        if (breeder?.location?.coordinates) {
            const [longitude, latitude] = breeder.location.coordinates;
            getAddressFromCoordinates(latitude, longitude).then(setAddress);
        }
    }, [breeder]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
            </div>
        );
    }

    if (!breeder) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-xl text-gray-600 font-medium">Profile not found</div>
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
        <div className="min-h-screen mt-[56px] bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 py-12 px-4">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden transform hover:scale-[1.005] transition-all duration-300">
                    {/* Banner Section */}
                    <div className="relative h-56 sm:h-72 lg:h-96 overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1587560699334-cc4ff634909a?q=80&w=2070&auto=format&fit=crop"
                            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                            alt="Banner"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    </div>

                    {/* Profile Section */}
                    <div className="relative px-8 lg:px-16 py-10">
                        <div className="absolute -top-28 left-10">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                                <img
                                    src={breeder.profile}
                                    alt={breeder.name}
                                    className="relative w-40 h-40 rounded-full border-4 border-white shadow-2xl object-cover"
                                />
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Main Info */}
                            <div className="lg:col-span-2 space-y-10">
                                <div>
                                    <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-600 bg-clip-text text-transparent">
                                        {breeder.name}
                                    </h1>
                                    <p className="mt-6 text-lg text-gray-600 leading-relaxed">{breeder.bio}</p>
                                </div>

                                {/* Location Info */}
                                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 space-y-4 ">
                                    <h3 className="text-2xl font-bold text-gray-800">Location</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <p className="text-gray-700 font-medium">{address.street || 'Street'}</p>
                                            <p className="text-gray-700 font-medium">{address.city || 'City'}, {address.state || 'State'}</p>
                                            <p className="text-gray-700 font-medium">{address.country || 'Country'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Section */}
                            <div className="space-y-8">
                                <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl p-8 space-y-8 shadow-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-4 bg-indigo-100 rounded-xl">
                                            <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-700 font-semibold">{breeder.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="p-4 bg-blue-100 rounded-xl">
                                            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-700 font-semibold">{breeder.phone}</span>
                                    </div>
                                </div>

                                <Link
                                    to={`/message/${breeder._id}`}
                                    className="group w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Start Conversation
                                    <MessageCircle className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                                </Link>
                            </div>
                        </div>
                    </div>


                    {/* Breeds Section */}
                    <div className="mt-10 max-w-6xl mx-auto bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-lg p-8 shadow-2xl rounded-3xl border border-white/20 transform transition-all duration-500 hover:shadow-3xl">
                        <h2 className="text-4xl sm:text-5xl text-center font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-10 animate-gradient">
                            {"About My Work"}
                        </h2>

                        {breeder && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {/* Breeds Section */}
                                {breeder.breeds && breeder.breeds.length > 0 ? (
                                    breeder.breeds.map((breed, index) => (
                                        <div
                                            key={index}
                                            className="group bg-gradient-to-br from-gray-100 via-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-200 overflow-hidden"
                                        >
                                            <div className="p-6 flex items-center space-x-4">
                                                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg flex items-center space-x-2 rounded-[80%]">
                                                    {animalImages[breed.animalType] && (
                                                        <img
                                                            src={animalImages[breed.animalType]}
                                                            alt={breed.animalType}
                                                            className="w-10 h-10 rounded-full"
                                                        />
                                                    )}

                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-800">{breed.animalType || "Unknown Animal"}</h3>
                                                    <p className="text-gray-600 text-sm">{breed.breed || "Unknown Breed"}</p>
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
                                                {breeder.statistics.successfulBreeds}+
                                            </p>
                                            <p className="text-sm font-semibold text-blue-600/90">
                                                Successful Breeds
                                            </p>
                                        </div>
                                        <div className="group bg-gradient-to-br from-purple-50 via-purple-100/50 to-purple-200/30 p-8 rounded-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-lg">
                                            <p className="text-4xl font-bold text-purple-800 mb-2 group-hover:scale-110 transition-transform">
                                                {breeder.statistics.yearsExperience}+
                                            </p>
                                            <p className="text-sm font-semibold text-purple-600/90">
                                                Years Experience
                                            </p>
                                        </div>
                                        <div className="group bg-gradient-to-br from-green-50 via-green-100/50 to-green-200/30 p-8 rounded-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-lg">
                                            <p className="text-4xl font-bold text-green-800 mb-2 group-hover:scale-110 transition-transform">
                                                {breeder.statistics.customerSatisfaction}%
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
                                    <BiCard />
                                </span>
                                Business Card
                            </h3>
                            {breeder.portfolio ? (
                                <div className="mt-2 border rounded-lg overflow-hidden shadow-sm transform transition-all duration-500 hover:scale-105">
                                    <a href={breeder.portfolio} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={breeder.portfolio}
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
                </div>
            </div>
        </div>
    );
};

export default BreederProfile;

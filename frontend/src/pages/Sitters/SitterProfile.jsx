import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { FaRocketchat } from "react-icons/fa6";

const SitterProfile = () => {

    const [sitter, setSitter] = useState([] || null);
    const [user, setUser] = useState([] || null);
    const { userSitterId, sitterId } = useParams();
    const [Ssitter, setSsitters] = useState([] || null);
    const [location, setLocation] = useState({ lat: '', lon: '' });
    const [address, setAddress] = useState({ street: '', city: '', state: '', country: '' });

    const fetchSitterById = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/sitters/sitter/${sitterId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'Application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            const data = await res.json();
            setSitter(data?.sitter);
        
        } catch (error) {
            toast.error(`Error while fetching:${error}`)
        }
    };

    const fetchSittersSuggested = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/sitters/all`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            const data = await res.json();
            setSsitters(data.sitters);
         
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => { fetchSittersSuggested() }, [])

    const fetchProfileById = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/auth/profile/${userSitterId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'Application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            const data = await res.json();
            setUser(data?.profile);
            const { coordinates } = data?.profile?.location || {};
            if (coordinates) {
                setLocation({ lat: coordinates[0], lon: coordinates[1] });
            } else {
                console.warn('No coordinates available in the profile');
            }
         
        } catch (error) {
            toast.error(`Error while fetching:${error}`)
        }
    }

    const fetchCityAndCountry = async (lat, lon) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
                {
                    headers: {
                        'User-Agent': 'Tailtenders/1.0 (tailtenders@example.com)',
                        'Accept-Language': 'en',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch location');
            }

            const data = await response.json();
            const address = data.display_name || 'Unknown Location';

            // Split the address into parts
            const addressParts = address.split(',').map(part => part.trim());

            // Extract relevant information
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
        if (user?.location?.coordinates) {
            const [longitude, latitude] = user?.location?.coordinates;
            fetchCityAndCountry(latitude, longitude).then((location) => {
                const { street, city, state, country } = location;
                setAddress({ street: street, city: city, state: state, country: country });
            });
        }
    }, [user]);

    useEffect(() => {
        fetchSitterById()
    }, [sitter]);

    useEffect(() => {
        fetchProfileById();
    }, [user]);

    const [isExpanded, setIsExpanded] = useState(false);
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

    const skills = ["Trainer", "Rescuer", "Professional Handler and Sitter", 'Wildlife Expert'];



    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full" />
                        <span className="font-medium">Kalki Network</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3z" />
                            </svg>
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full" />
                            <span className="font-medium">Adrian, Q.</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Banner and Profile */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="h-48 bg-gradient-to-r from-blue-900 to-blue-400 relative">
                                <img
                                    src="https://t3.ftcdn.net/jpg/03/50/68/30/360_F_350683074_SSaXPN4XBvmwEKWRG4aU18Kl7kwkOdrg.jpg"
                                    alt="Profile banner"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute -bottom-12 left-8">
                                    <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden">
                                        <img
                                            src={user?.profile}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-16 px-8 pb-8">
                                <div className="flex justify-between items-start">
                                    <div className="">
                                        <h1 className="text-2xl font-bold">{user?.name}</h1>
                                        {/*<span>{RatingStars(sitter?.reviews?.map((r)=>{r}))}</span> */}
                                        <span>
                                            {RatingStars({
                                                rating: sitter?.reviews?.reduce((acc, review) => acc + review.rating, 0) / sitter?.reviews?.length || 0,
                                            })}
                                        </span>
                                        <p className="text-gray-600 mt-1">{user?.bio}</p>
                                        <p className="text-gray-500 text-sm mt-1">{address.city},{address.country}</p>
                                    </div>
                                    <button className="mt-8 px-2 py-2 h-[35px] text-[8px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        <FaRocketchat size={20} />
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-6">
                                    {skills.map((skill) => (
                                        <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 bg-white dark:bg-gray-900 rounded-lg shadow p-8">
                            {/* About Me Section */}
                            <div className="mt-8 space-y-4">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">About Me</h2>
                                <div className={`space-y-4 text-gray-700 dark:text-gray-300 ${!isExpanded && "line-clamp-3"}`}>
                                    <p>
                                        Hi, my name is <span className="font-semibold">{user?.name}</span> (
                                        <span className="text-blue-600 dark:text-blue-400">{user?.email}</span>)
                                    </p>
                                    <p>{user?.bio}</p>
                                    <p>
                                        Head of Design might be an overstatement, but as with many 20-people agencies, I wear many hats. I manage
                                        creative teams and set up processes that allow collaborators and clients to achieve growth, scalability, and
                                        progress.
                                    </p>
                                    <p>
                                        My design journey began in 2012, sitting across from my brother in our home office on the island of Krk, Croatia. We
                                        designed our way across 99designs and later ranked among the Dribbble Top 20 teams globally.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    {isExpanded ? "Read Less" : "Read More..."}
                                </button>
                            </div>
                            <hr className="border-gray-600 bg-gray-300 my-8 w-full" />
                            {/* User Feedback Section */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">User Feedback</h2>
                                {sitter?.reviews?.length ? (
                                    <div className="space-y-4">
                                        {sitter.reviews.map((review, index) => (
                                            <div
                                                key={index}
                                                className="p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="font-medium text-gray-900 dark:text-gray-200">
                                                            {review.name || "Anonymous User"}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <RatingStars rating={review.rating} />
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-gray-600 dark:text-gray-400">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600 dark:text-gray-400">No reviews yet.</p>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-80 space-y-6">
                        {/* Location */}

                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="font-bold mb-4">Location</h2>
                            <div className="flex items-center gap-2 text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                <span>{address?.country ? address?.country : 'Kalkio Network'}</span>
                            </div>
                        </div>

                        {/* Connect */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="font-bold mb-4">Connect</h2>
                            <div className="space-y-3">
                                <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 7h-2v-6h2v6z" />
                                    </svg>
                                    <span>about.me/adrianm</span>
                                </a>
                                <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    <span>Facebook</span>
                                </a>
                                <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                    <span>Instagram</span>
                                </a>
                            </div>
                        </div>

                        {/* Similar Profiles */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="font-bold text-2xl text-gray-800 mb-4">Suggested Sitters</h2>
                            <div className="space-y-4">
                                {Ssitter.map((profile) => (
                                    <div
                                        key={profile.name}
                                        className="flex items-center gap-4 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-50"
                                    >
                                        <Link to={`/sitter/profile/${profile?.UserSid}/${profile?.sitterId}`} className="flex items-center gap-4 w-full">
                                            <img
                                                src={profile.profile}
                                                alt={profile.name}
                                                className="w-12 h-12 rounded-full border-2 border-gray-300 transition-all duration-200 hover:border-primary"
                                            />
                                            <div className="flex flex-col">
                                                <p className="font-medium text-lg text-gray-800">{profile.name}</p>
                                                <p className="text-sm text-gray-600">{profile.industry}</p>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SitterProfile;
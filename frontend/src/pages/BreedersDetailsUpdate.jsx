import React from 'react';
import { useNavigate } from 'react-router-dom';

const BreedersDetailUpdate = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen mt-[80px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20">
                    <div className="px-8 py-6 border-b border-gray-200/50">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Update Breeder Profile</h2>
                        <p className="mt-2 text-gray-600">Enhance your breeding expertise and showcase your achievements</p>
                    </div>

                    <div className="p-8">
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">Available Breeds</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                                    <h4 className="font-semibold text-gray-800">Persian Cat</h4>
                                    <select className="mt-2 w-full p-2 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                        <option>Available</option>
                                        <option>Limited</option>
                                        <option>Sold Out</option>
                                    </select>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                                    <h4 className="font-semibold text-gray-800">Siamese Cat</h4>
                                    <select className="mt-2 w-full p-2 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                        <option>Available</option>
                                        <option>Limited</option>
                                        <option>Sold Out</option>
                                    </select>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                                    <h4 className="font-semibold text-gray-800">Maine Coon</h4>
                                    <select className="mt-2 w-full p-2 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                        <option>Available</option>
                                        <option>Limited</option>
                                        <option>Sold Out</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">Breeding Statistics</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                                    <label className="text-sm font-medium text-gray-600">Dogs</label>
                                    <input 
                                        type="number"
                                        className="w-full mt-1 p-2 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        defaultValue={25}
                                    />
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                                    <label className="text-sm font-medium text-gray-600">Cats</label>
                                    <input 
                                        type="number"
                                        className="w-full mt-1 p-2 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        defaultValue={30}
                                    />
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                                    <label className="text-sm font-medium text-gray-600">Birds</label>
                                    <input 
                                        type="number"
                                        className="w-full mt-1 p-2 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        defaultValue={15}
                                    />
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                                    <label className="text-sm font-medium text-gray-600">Rabbits</label>
                                    <input 
                                        type="number"
                                        className="w-full mt-1 p-2 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        defaultValue={8}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate('/profile')}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => navigate('/profile')}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BreedersDetailUpdate;
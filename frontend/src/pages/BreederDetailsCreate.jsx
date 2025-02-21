import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BreederDetailsCreate = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        breeds: [],
        statistics: { successfulBreeds: 0, yearsExperience: 0, customerSatisfaction: 0 }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Handle breed field changes
    const handleBreedChange = (index, event) => {
        const { name, value } = event.target;
        const updatedBreeds = [...formData.breeds];
        updatedBreeds[index][name] = value;
        setFormData({ ...formData, breeds: updatedBreeds });
    };

    // Add a new breed
    const addBreed = () => {
        setFormData({
            ...formData,
            breeds: [...formData.breeds, { animalType: '', breed: '', status: '', price: '', description: '' }]
        });
    };

    // Remove a breed
    const removeBreed = (index) => {
        const updatedBreeds = formData.breeds.filter((_, i) => i !== index);
        setFormData({ ...formData, breeds: updatedBreeds });
    };

    // Handle statistics field changes
    const handleStatisticsChange = (event) => {
        setFormData({
            ...formData,
            statistics: { ...formData.statistics, [event.target.name]: event.target.value }
        });
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/create-breeder-details`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create breeder details');
            }

            setSuccess(true);
            setTimeout(() => navigate('/profile'), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen mt-[80px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-purple-100">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white/80 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl border border-white/20 p-8">
                    <h2 className="text-4xl font-black text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
                        Create Your Breeder Profile
                    </h2>

                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    {success && <p className="text-green-500 text-center mb-4">Profile created successfully! Redirecting...</p>}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Breeds Section */}
                        <div>
                            <label className="block text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                                Breeds You Offer
                            </label>
                            {formData.breeds.map((breed, index) => (
                                <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end bg-gray-100 p-4 rounded-lg mb-3">
                                    <select
                                        name="animalType"
                                        value={breed.animalType}
                                        onChange={(e) => handleBreedChange(index, e)}
                                        required
                                        className="p-3 border rounded-lg"
                                    >
                                        <option value="">Select Animal</option>
                                        <option value="Dog">Dog</option>
                                        <option value="Cat">Cat</option>
                                        <option value="Bird">Bird</option>
                                        <option value="Rabbit">Rabbit</option>
                                        <option value="Hamster">Hamster</option>
                                        <option value="Fish">Fish</option>
                                        <option value="Reptile">Reptile</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <input
                                        type="text"
                                        name="breed"
                                        placeholder="Breed Name"
                                        value={breed.breed}
                                        onChange={(e) => handleBreedChange(index, e)}
                                        required
                                        className="p-3 border rounded-lg"
                                    />
                                    <select
                                        name="status"
                                        value={breed.status}
                                        onChange={(e) => handleBreedChange(index, e)}
                                        required
                                        className="p-3 border rounded-lg"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Available">Available</option>
                                        <option value="Coming Soon">Coming Soon</option>
                                        <option value="Sold Out">Sold Out</option>
                                        <option value="Limited">Limited</option>
                                    </select>
                                    <input
                                        type="number"
                                        name="price"
                                        placeholder="Price ($)"
                                        value={breed.price}
                                        onChange={(e) => handleBreedChange(index, e)}
                                        required
                                        className="p-3 border rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeBreed(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addBreed}
                                className="mt-3 text-indigo-600 font-semibold hover:underline"
                            >
                                + Add Another Breed
                            </button>
                        </div>

                        {/* Breeding Statistics */}
                        <div>
                            <label className="block text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                                Breeding Statistics
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <input
                                    type="number"
                                    name="successfulBreeds"
                                    placeholder="Successful Breeds"
                                    value={formData.statistics.successfulBreeds}
                                    onChange={handleStatisticsChange}
                                    required
                                    className="p-3 border rounded-lg"
                                />
                                <input
                                    type="number"
                                    name="yearsExperience"
                                    placeholder="Years of Experience"
                                    value={formData.statistics.yearsExperience}
                                    onChange={handleStatisticsChange}
                                    required
                                    className="p-3 border rounded-lg"
                                />
                                <input
                                    type="number"
                                    name="customerSatisfaction"
                                    placeholder="Customer Satisfaction (%)"
                                    value={formData.statistics.customerSatisfaction}
                                    onChange={handleStatisticsChange}
                                    required
                                    min="0"
                                    max="100"
                                    className="p-3 border rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition"
                            >
                                {loading ? 'Submitting...' : 'Create Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BreederDetailsCreate;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BreederDetails = () => {
    const { breederId } = useParams();
    const [breeder, setBreeder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBreederDetails = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/breeder-details/${breederId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                });
          
                // Ensure response is JSON
                const contentType = response.headers.get('content-type');
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Invalid response format. Expected JSON.');
                }

                const data = await response.json();
                setBreeder(data.breederDetails);
                console.log(data.breederDetails);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBreederDetails();
    }, [breederId]);

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center text-lg font-semibold">Loading...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex justify-center items-center text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-3xl font-bold text-indigo-700 text-center">Breeder Profile</h2>

                <div className="mt-6 border-b pb-4">
                    <h3 className="text-xl font-semibold">Breeder: {breeder.breeder.name}</h3>
                    <p className="text-gray-600">Email: {breeder.breeder.email}</p>
                </div>

                <div className="mt-6 border-b pb-4">
                    <h3 className="text-xl font-semibold">Breeding Statistics</h3>
                    <p>Successful Breeds: {breeder.statistics.successfulBreeds}</p>
                    <p>Years of Experience: {breeder.statistics.yearsExperience}</p>
                    <p>Customer Satisfaction: {breeder.statistics.customerSatisfaction}%</p>
                </div>

                <div className="mt-6">
                    <h3 className="text-xl font-semibold">Breeds Available</h3>
                    {breeder.breeds.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            {breeder.breeds.map((breed, index) => (
                                <div key={index} className="bg-gray-100 p-4 rounded-lg">
                                    <p className="font-semibold text-lg">{breed.breed} ({breed.animalType})</p>
                                    <p className="text-gray-600">Status: {breed.status}</p>
                                    <p className="text-gray-600">Price: ${breed.price}</p>
                                    {breed.description && <p className="text-gray-500 mt-1">{breed.description}</p>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 mt-4">No breeds listed yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BreederDetails;

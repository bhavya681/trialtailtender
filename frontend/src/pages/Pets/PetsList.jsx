import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PetsList = () => {
  const [pets, setPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    breed: "",
    ageRange: ""
  });

  const fetchPets = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pets`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setPets(data.pets);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePet = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pets/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Successfully Deleted");
        fetchPets();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filters.type === "" || pet.type === filters.type;
    const matchesBreed = filters.breed === "" || pet.breed === filters.breed;
    const matchesAge = filters.ageRange === "" || 
      (filters.ageRange === "0-2" && pet.age >= 0 && pet.age <= 2) ||
      (filters.ageRange === "3-7" && pet.age >= 3 && pet.age <= 7) ||
      (filters.ageRange === "8+" && pet.age >= 8);

    return matchesSearch && matchesType && matchesBreed && matchesAge;
  });

  const uniqueTypes = [...new Set(pets.map(pet => pet.type))];
  const uniqueBreeds = [...new Set(pets.map(pet => pet.breed))];

  return (
    <div className="container mx-auto mt-24 px-4 sm:px-6 lg:px-8 mb-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl -z-10" />
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <div className="absolute bottom-0 -right-4 w-72 h-72 bg-violet-400/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />

        <motion.h1
          className="text-5xl font-black text-center pt-8 pb-4 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Your Pet Family
        </motion.h1>

        <div className="text-center mb-12">
          <Link
            to="/pet"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Add New Pet
            <span className="ml-2 text-2xl">+</span>
          </Link>
        </div>

        {/* Search and Filters Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search pets by name or breed..."
                className="w-full px-6 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <select
              className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400"
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400"
              value={filters.breed}
              onChange={(e) => setFilters({...filters, breed: e.target.value})}
            >
              <option value="">All Breeds</option>
              {uniqueBreeds.map(breed => (
                <option key={breed} value={breed}>{breed}</option>
              ))}
            </select>

            <select
              className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400"
              value={filters.ageRange}
              onChange={(e) => setFilters({...filters, ageRange: e.target.value})}
            >
              <option value="">All Ages</option>
              <option value="0-2">0-2 years</option>
              <option value="3-7">3-7 years</option>
              <option value="8+">8+ years</option>
            </select>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          {filteredPets.map((pet) => (
            <motion.div
              key={pet._id}
              className="bg-white backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative mb-6">
                <motion.div
                  className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full opacity-75 blur"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.75 }}
                />
                <motion.img
                  src={pet.pic}
                  alt={pet.name}
                  className="relative w-40 h-40 object-cover rounded-full mx-auto border-4 border-white"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">{pet.name}</h2>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-center space-x-2">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-blue-100 to-violet-100 rounded-full text-blue-800 font-medium">
                    {pet.type}
                  </span>
                </div>
                <p className="text-gray-600">Age: {pet.age} years</p>
                <p className="text-gray-600">Breed: {pet.breed}</p>
              </div>

              <div className="flex justify-center gap-4">
                <Link
                  to={`/editpet/${pet._id}`}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deletePet(pet._id)}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PetsList;

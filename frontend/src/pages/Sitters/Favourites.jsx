import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);

  // Load favourites from localStorage
  useEffect(() => {
    const savedFavourites = JSON.parse(localStorage.getItem("favourites")) || [];
    setFavourites(savedFavourites);
  }, []);

  const handleDelete = (id) => {
    const updatedFavourites = favourites.filter(fav => fav._id !== id);
    setFavourites(updatedFavourites);
    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
    toast.success("Sitter removed from favorites");
  };

  return (
    <div className="max-w-7xl mx-auto mt-40 p-4 sm:p-6 lg:p-8">
      <section className="bg-gradient-to-r from-green-50 to-teal-100 shadow-lg rounded-3xl p-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-green-700 mb-8">
          Your Favourite Sitters
        </h2>

        {/* Favourites Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {favourites.map((fav) => (
            <div
              key={fav._id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition relative"
            >
              <img
                src={fav.profile || "/placeholder.svg"}
                alt={fav.name}
                className="w-32 h-32 object-cover rounded-full mx-auto"
              />
              <h3 className="text-xl font-bold text-center mt-4 text-green-700">
                {fav.name}
              </h3>
              <p className="text-center text-gray-500 mt-2">Email: {fav.email}</p>
              <p className="text-center text-gray-500">
                Experience: {fav.experience} years
              </p>
              <button
                onClick={() => handleDelete(fav._id)}
                className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>

        {favourites.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            You have not added any sitters to your favourites yet.
          </p>
        )}
      </section>
    </div>
  );
};

export default Favourites;

// import React, { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { Link, useNavigate } from "react-router-dom";

// export default function Register() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "owner",
//     location: { coordinates: [] }, // Default empty array for coordinates
//     profile: "",bio:"",phone:""
//   });

//   // Get the user's current location using Geolocation API
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setForm((prevForm) => ({
//             ...prevForm,
//             location: {
//               coordinates: [position.coords.longitude, position.coords.latitude], // [longitude, latitude]
//             },
//           }));
//         },
//         (error) => {
//           toast.error("Unable to fetch location.");
//           console.error(error);
//         }
//       );
//     } else {
//       toast.error("Geolocation is not supported by this browser.");
//     }
//   }, []);

//   // Handle the change in the profile image URL input
//   const handleProfileUrlChange = (e) => {
//     setForm((prevForm) => ({
//       ...prevForm,
//       profile: e.target.value, // Store the URL entered by the user
//     }));
//   };

//   const fetchDetails = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(form),
//       });
//       const data = await res.json();
//       localStorage.getItem('userName',data.name)
//       if (data.success) {
//         toast.success(data.message);
//         navigate("/login");
//       } else {
//         throw new Error(data.message || "Failed to register. Please try again.");
//       }
//     } catch (error) {
//       toast.error(error.message || "Something went wrong.");
//       console.error("Error during registration:", error);
//     }
//   };

//   const handleValues = (e) => {
//     setForm((prevForm) => ({
//       ...prevForm,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
//       <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold">Create an Account</h2>
//           <p className="text-sm text-gray-600">Enter your details to register</p>
//         </div>
//         <form className="space-y-4 mt-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Full Name</label>
//             <input
//               id="name"
//               name="name"
//               type="text"
//               required
//               className="mt-1 block w-full border-gray-300 rounded-md p-1 shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               placeholder="John Doe"
//               value={form.name}
//               onChange={handleValues}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               id="email"
//               name="email"
//               type="email"
//               required
//               className="mt-1 block w-full border-gray-300 rounded-md p-1 shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               placeholder="you@example.com"
//               value={form.email}
//               onChange={handleValues}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Bio</label>
//             <input
//               id="bio"
//               name="bio"
//               type="text"
//               required
//               className="mt-1 block w-full border-gray-300 rounded-md p-1 shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter Bio"
//               value={form.bio}
//               onChange={handleValues}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Password</label>
//             <input
//               id="password"
//               name="password"
//               type="password"
//               required
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-1 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="••••••••"
//               value={form.password}
//               onChange={handleValues}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Phone No</label>
//             <input
//               id="phone"
//               name="phone"
//               type="text"
//               required
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-1 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter Phone Number"
//               value={form.phone}
//               onChange={handleValues}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Role</label>
//             <div className="flex gap-4 mt-2">
//               <label className="inline-flex items-center">
//                 <input
//                   type="radio"
//                   name="role"
//                   value="owner"
//                   checked={form.role === "owner"}
//                   onChange={handleValues}
//                   className="text-blue-600 focus:ring-blue-500"
//                 />
//                 <span className="ml-2 text-gray-700">Owner</span>
//               </label>
//               <label className="inline-flex items-center">
//                 <input
//                   type="radio"
//                   name="role"
//                   value="sitter"
//                   checked={form.role === "sitter"}
//                   onChange={handleValues}
//                   className="text-blue-600 focus:ring-blue-500"
//                 />
//                 <span className="ml-2 text-gray-700">Sitter</span>
//               </label>
//               <label className="inline-flex items-center">
//                 <input
//                   type="radio"
//                   name="role"
//                   value="breeder"
//                   checked={form.role === "breeder"}
//                   onChange={handleValues}
//                   className="text-blue-600 focus:ring-blue-500"
//                 />
//                 <span className="ml-2 text-gray-700">Breeder</span>
//               </label>
//             </div>
//           </div>
//           {/* Profile Image URL */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Profile Image URL</label>
//             <input
//               type="text"
//               placeholder="https://example.com/profile.jpg"
//               value={form.profile}
//               onChange={handleProfileUrlChange}
//               className="mt-1 block w-full text-sm text-gray-700 border-gray-300 rounded-md p-1 focus:ring-blue-500 focus:border-blue-500"
//             />
//             {form.profile && (
//               <div className="mt-2">
//                 <img
//                   src={form.profile}
//                   alt="Profile preview"
//                   className="w-24 h-24 rounded-full object-cover"
//                 />
//               </div>
//             )}
//           </div>
//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               fetchDetails();
//             }}
//             className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
//           >
//             Register
//           </button>
//         </form>
//         <div className="text-center mt-4">
//           <Link to="/login" className="text-sm text-blue-600 hover:underline">
//             Already have an account? Sign in
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
//  }


import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  useState, useEffect
} from "react";
export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "owner",
    location: { coordinates: [] },
    profile: "",
    bio: "",
    phone: "",
    portfolio: "",
    breeds: [],
    statistics: {
      successfulBreeds: 0,
      yearsExperience: 0,
      customerSatisfaction: 0,
    },
  });

  // Fetch user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm((prev) => ({
            ...prev,
            location: {
              coordinates: [position.coords.longitude, position.coords.latitude],
            },
          }));
        },
        () => toast.error("Unable to fetch location.")
      );
    } else {
      toast.error("Geolocation is not supported.");
    }
  }, []);

  // Handle Input Changes
  const handleValues = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("statistics.")) {
      const fieldName = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        statistics: { ...prev.statistics, [fieldName]: Number(value) },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Add Breed for Breeders
  const addBreed = () => {
    setForm((prev) => ({
      ...prev,
      breeds: [
        ...prev.breeds,
        { animalType: "", breed: "" },
      ],
    }));
  };

  // Handle Breed Changes
  const handleBreedChange = (index, field, value) => {
    const updatedBreeds = [...form.breeds];
    updatedBreeds[index][field] = value;
    setForm((prev) => ({ ...prev, breeds: updatedBreeds }));
  };

  // Remove Breed
  const removeBreed = (index) => {
    setForm((prev) => ({
      ...prev,
      breeds: prev.breeds.filter((_, i) => i !== index),
    }));
  };

  // Submit Form
  const fetchDetails = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        throw new Error(data.message || "Failed to register.");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen mt-[89px] flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-12">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Breeder Registration</h2>
          <form className="space-y-5">
            {/* Profile Image */}
            <input
              type="text"
              name="profile"
              placeholder="Profile Image URL"
              value={form.profile}
              onChange={handleValues}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {form.profile && (
              <img src={form.profile} alt="Profile Preview" className="w-24 h-24 rounded-full mx-auto mt-2 border" />
            )}

            {/* Basic Inputs */}
            {[
              { type: "text", name: "name", placeholder: "Full Name" },
              { type: "email", name: "email", placeholder: "Email" },
              { type: "password", name: "password", placeholder: "Password" },
              { type: "text", name: "bio", placeholder: "Bio" },
              { type: "text", name: "phone", placeholder: "Phone Number" },
            ].map((field) => (
              <input
                key={field.name}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleValues}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            ))}

            {/* Role Selection */}
            <div className="flex justify-around">
              {["owner", "sitter", "breeder"].map((role) => (
                <label key={role} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={form.role === role}
                    onChange={handleValues}
                    className="hidden peer"
                  />
                  <span className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium peer-checked:bg-blue-600 peer-checked:text-white transition-all">
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                </label>
              ))}
            </div>

            {/* Breeder-Specific Fields */}
            {form.role === "breeder" && (
              <>
                <input
                  type="text"
                  name="portfolio"
                  placeholder="Business Card / Portfolio"
                  value={form.portfolio}
                  onChange={handleValues}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: "statistics.successfulBreeds", placeholder: "Successful Breeds", label: "Successful Breeds" },
                    { name: "statistics.yearsExperience", placeholder: "Years Experience", label: "Years of Experience" },
                    { name: "statistics.customerSatisfaction", placeholder: "Satisfaction (%)", label: "Customer Satisfaction (%)" },
                  ].map((field) => (
                    <div key={field.name} className="flex flex-col">
                      <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                        {field.label}
                      </label>
                      <input
                        id={field.name}
                        type="number"
                        name={field.name}
                        placeholder={field.placeholder}
                        value={form.statistics[field.name.split(".")[1]]}
                        onChange={handleValues}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  ))}
                </div>
                {/* Breeds */}
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={addBreed}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    + Add Breed
                  </button>
                  {form.breeds.map((breed, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Animal Type"
                        value={breed.animalType}
                        onChange={(e) => handleBreedChange(index, "animalType", e.target.value)}
                        className="border p-2 rounded-md"
                      />
                      <input
                        type="text"
                        placeholder="Breed"
                        value={breed.breed}
                        onChange={(e) => handleBreedChange(index, "breed", e.target.value)}
                        className="border p-2 rounded-md"
                      />
                      <button onClick={() => removeBreed(index)} className="text-red-500">✖</button>
                    </div>
                  ))}
                </div>
              </>
            )}

            <button onClick={(e) => { e.preventDefault(); fetchDetails(); }} className="w-full py-3 bg-blue-600 text-white rounded-lg">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}





// import React, { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { Link, useNavigate } from "react-router-dom";

// export default function Register() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "owner",
//     location: { coordinates: [] },
//     profile: "",
//     bio: "",
//     phone: "",
//     portfolio: "",
//     breeds: [],
//     statistics: {
//       successfulBreeds: 0,
//       yearsExperience: 0,
//       customerSatisfaction: 0,
//     },
//   });

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setForm((prevForm) => ({
//             ...prevForm,
//             location: {
//               coordinates: [position.coords.longitude, position.coords.latitude],
//             },
//           }));
//         },
//         () => toast.error("Unable to fetch location.")
//       );
//     } else {
//       toast.error("Geolocation is not supported by this browser.");
//     }
//   }, []);

//   const handleValues = (e) => {
//     const { name, value } = e.target;

//     // Check if the field belongs to the statistics object
//     if (name.startsWith("statistics.")) {
//       const fieldName = name.split(".")[1]; // Extract property name after "statistics."
//       setForm((prevForm) => ({
//         ...prevForm,
//         statistics: {
//           ...prevForm.statistics, // Preserve other statistics properties
//           [fieldName]: Number(value), // Convert value to a number
//         },
//       }));
//     } else {
//       setForm((prevForm) => ({
//         ...prevForm,
//         [name]: value,
//       }));
//     }
//   };


//   const fetchDetails = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       const data = await res.json();
//       if (data.success) {
//         toast.success(data.message);
//         navigate("/login");
//       } else {
//         throw new Error(data.message || "Failed to register.");
//       }
//     } catch (error) {
//       toast.error(error.message || "Something went wrong.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center mt-[64px] bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-12">
//       <div className="w-full max-w-lg bg-white shadow-2xl rounded-xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
//         <div className="p-8">
//           <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-2">Create an Account</h2>
//           <p className="text-sm text-gray-600 text-center mb-6">Join us by entering your details below.</p>

//           <form className="space-y-5">
//             {/* Input Fields */}
//             {[
//               { type: "text", name: "name", placeholder: "Full Name" },
//               { type: "email", name: "email", placeholder: "Email" },
//               { type: "password", name: "password", placeholder: "Password" },
//               { type: "text", name: "bio", placeholder: "Bio" },
//               { type: "text", name: "phone", placeholder: "Phone Number" },
//             ].map((field) => (
//               <input
//                 key={field.name}
//                 type={field.type}
//                 name={field.name}
//                 placeholder={field.placeholder}
//                 value={form[field.name]}
//                 onChange={handleValues}
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 required
//               />
//             ))}

//             {/* Profile Image URL */}
//             <input
//               type="text"
//               name="profile"
//               placeholder="Profile Image URL"
//               value={form.profile}
//               onChange={handleValues}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//               required
//             />
//             {form.profile && (
//               <img
//                 src={form.profile}
//                 alt="Profile preview"
//                 className="w-24 h-24 rounded-full mx-auto mt-2 border-4 border-white shadow-md"
//               />
//             )}
//             {/* Role Selection */}
//             <div className="flex justify-between mt-4">
//               {["owner", "sitter", "breeder"].map((role) => (
//                 <label key={role} className="flex items-center space-x-2 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="role"
//                     value={role}
//                     checked={form.role === role}
//                     onChange={handleValues}
//                     className="hidden peer"
//                   />
//                   <span className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600 peer-checked:text-white peer-checked:border-transparent transition-all">
//                     {role.charAt(0).toUpperCase() + role.slice(1)}
//                   </span>
//                 </label>
//               ))}
//             </div>

//             {/* Breeder-Specific Fields */}
//             {form.role === "breeder" && (
//               <div className="space-y-4">
//                 <input
//                   type="text"
//                   name="portfolio"
//                   placeholder="Business Card"
//                   value={form.portfolio}
//                   onChange={handleValues}
//                   className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   required
//                 />
//                 <div className="grid grid-cols-3 gap-4">
//                   {[
//                     { name: "statistics.successfulBreeds", placeholder: "Successful Breeds" },
//                     { name: "statistics.yearsExperience", placeholder: "Years of Experience" },
//                     { name: "statistics.customerSatisfaction", placeholder: "Satisfaction (%)" },
//                   ].map((field) => (
//                     <input
//                       key={field.name}
//                       type="number"
//                       name={field.name}
//                       placeholder={field.placeholder}
//                       value={form.statistics[field.name.split(".")[1]]}
//                       onChange={handleValues}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     />
//                   ))}
//                 </div>

//               </div>
//             )}


//             {/* Register Button */}
//             <button
//               onClick={(e) => { e.preventDefault(); fetchDetails(); }}
//               className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all"
//             >
//               Register
//             </button>
//           </form>

//           {/* Login Link */}
//           <div className="text-center mt-6">
//             <Link
//               to="/login"
//               className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-all"
//             >
//               Already have an account? Sign in
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



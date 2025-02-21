// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const EditProfile = () => {
//   const [data, setData] = useState([]);
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     latitude: '',
//     longitude: '',
//     role: '',
//     profile: '',
//     phone:''
//   });
//   const [locationUpdated, setLocationUpdated] = useState(false);

//   const fetchDetails = async () => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/auth/profile`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       const data = await res.json();
//       if (data.success) {
//         setData(data.user);
//         setForm({
//           name: data.user.name,
//           email: data.user.email,
//           latitude: data.user.location.coordinates[1] || '', // Latitude
//           longitude: data.user.location.coordinates[0] || '', // Longitude
//           role: data.user.role,
//           profile: data.user.profile,
//           phone:data.user.phone
//         });
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Failed to fetch user details.");
//     }
//   };

//   useEffect(() => { fetchDetails(); }, []);

  // const changeVal = (e) => {
  //   setForm((prevForm) => ({ ...prevForm, [e.target.name]: e.target.value }));
  // };

//   const updateDetails = async (e) => {
//     e.preventDefault();
    
//     // Validate latitude and longitude inputs
//     const lat = parseFloat(form.latitude);
//     const lon = parseFloat(form.longitude);
    
//     if (isNaN(lat) || isNaN(lon)) {
//       toast.error("Please enter valid latitude and longitude values.");
//       return;
//     }

//     try {
//       const updates = {
//         name: form.name,
//         email: form.email,
//         role: form.role,
//         profile: form.profile,
//         phone:form.phone
//       };

      // // Include location if it has been updated
      // if (locationUpdated || (form.latitude && form.longitude)) {
      //   updates.location = {
      //     type: 'Point',
      //     coordinates: [
      //       lon, // Longitude first
      //       lat  // Latitude second
      //     ],
      //   };
      // }

//       const res = await fetch('http://localhost:5000/api/auth/edit-profile', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify(updates),
//       });

//       const data = await res.json();
//       if (data.success) {
//         toast.success('Successfully Updated');
//         navigate('/profile');
//       } else {
//         toast.success(data.message || 'Update failed');
//         navigate('/profile');
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("An error occurred while updating.");
//     }
//   };

//   const handleLocationUpdate = async () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;
          
//           // Update form state with new coordinates
//           setForm((prevForm) => ({
//             ...prevForm,
//             latitude,
//             longitude
//           }));

//           // Set locationUpdated to true to indicate that location has changed
//           setLocationUpdated(true);

//           // Optionally, you can directly update the backend here if needed
//           try {
//             const updates = {
//               location: {
//                 type: 'Point', // Ensure type comes first
//                 coordinates: [parseFloat(longitude), parseFloat(latitude)], // Longitude first, Latitude second
//               }
//             };

//             const res = await fetch('http://localhost:5000/api/auth/edit-profile', {
//               method: 'PUT',
//               headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`,
//               },
//               body: JSON.stringify(updates),
//             });

//             const data = await res.json();
//             if (data.success) {
//               toast.success('Location updated successfully!');
//             } else {
//               toast.success(data.message || 'Location update failed');
//             }
//           } catch (error) {
//             console.log(error);
//             toast.error("An error occurred while updating location.");
//           }
//         },
//         (error) => {
//           console.error(error);
//           toast.error("Unable to retrieve your location.");
//         }
//       );
//     } else {
//       toast.error("Geolocation is not supported by this browser.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center mt-[81px] justify-center">
//       <div className="bg-white shadow-md rounded-lg p-6 w-96">
//         <h2 className="text-xl font-bold mb-4 text-center">Edit Profile</h2>
//         <form onSubmit={updateDetails}>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
//             <input
//               type="text"
//               className="w-full border border-gray-300 rounded px-3 py-2"
//               placeholder="Enter your name"
//               name="name"
//               onChange={changeVal}
//               value={form.name}
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
//             <input
//               type="email"
//               className="w-full border border-gray-300 rounded px-3 py-2"
//               placeholder="Enter your email"
//               name="email"
//               onChange={changeVal}
//               value={form.email}
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
//             <input
//               type="text"
//               className="w-full border border-gray-300 rounded px-3 py-2"
//               placeholder="Enter your phone"
//               name="phone"
//               onChange={changeVal}
//               value={form.phone}
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Profile Image</label>
//             <input
//               type="text"
//               className="w-full border border-gray-300 rounded px-3 py-2"
//               placeholder="Enter link of your profile picture"
//               name="profile"
//               onChange={changeVal}
//               value={form.profile}
//             />
//           </div>
          // <div className="mb-4">
          //   <label className="block text-gray-700 text-sm font-bold mb-2">Latitude</label>
          //   <input
          //     type="number"
          //     step="any" // Allows decimal values for latitude
          //     className="w-full border border-gray-300 rounded px-3 py-2"
          //     placeholder="Enter latitude"
          //     name="latitude"
          //     onChange={changeVal}
          //     value={form.latitude}
          //   />
          // </div>
          // <div className="mb-4">
          //   <label className="block text-gray-700 text-sm font-bold mb-2">Longitude</label>
          //   <input
          //     type="number"
          //     step="any" // Allows decimal values for longitude
          //     className="w-full border border-gray-300 rounded px-3 py-2"
          //     placeholder="Enter longitude"
          //     name="longitude"
          //     onChange={changeVal}
          //     value={form.longitude}
          //   />
          // </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
//             <input
//               type="text"
//               className="w-full border border-gray-300 rounded px-3 py-2"
//               placeholder="Enter your role"
//               name="role"
//               onChange={changeVal}
//               value={form.role}
//             />
//           </div>
//           <div className="mb-4 flex justify-center gap-4">
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full md:w-auto hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//             >
//               Save Changes
//             </button>
//             <button
//               type="button"
//               className="bg-green-600 text-white px-6 py-3 rounded-lg w-full md:w-auto hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
//               onClick={handleLocationUpdate}
//             >
//               Update Location
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditProfile;


import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    profile: "",
    latitude: "",
    longitude: "",
    role: "",
    portfolio: "",
    breeds: [],
    statistics: {
      successfulBreeds: 0,
      yearsExperience: 0,
      customerSatisfaction: 0,
    },
  });

  const [locationUpdated, setLocationUpdated] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setData(data.user);
          setForm({
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
            profile: data.user.profile,
            latitude: data.user.location?.coordinates[1] || "",
            longitude: data.user.location?.coordinates[0] || "",
            role: data.user.role,
            portfolio: data.user.portfolio || "",
            breeds: data.user.breeds || [],
            statistics: data.user.statistics
          });
        } else {
          toast.error("Failed to fetch user details.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while fetching user details.");
      }
    };

    fetchDetails();
  }, []);

 
  const changeVal = (e) => {
    setForm((prevForm) => ({ ...prevForm, [e.target.name]: e.target.value }));
  };
  
  // Handle input changes
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setForm((prevForm) => ({ ...prevForm, [name]: value }));
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    setForm((prevForm) => {
      // Check if the input belongs to `statistics`
      if (Object.keys(prevForm.statistics).includes(name)) {
        return {
          ...prevForm,
          statistics: {
            ...prevForm.statistics,
            [name]: Number(value), // Convert to number to prevent string issues
          },
        };
      }
  
      return { ...prevForm, [name]: value };
    });
  };
  

  // Handle breed updates
  const handleBreedChange = (index, field, value) => {
    setForm((prev) => {
      const updatedBreeds = [...prev.breeds];
      updatedBreeds[index][field] = value;
      return { ...prev, breeds: updatedBreeds };
    });
  };

  // Add a new breed
  const addBreed = () => {
    setForm((prev) => ({
      ...prev,
      breeds: [
        ...prev.breeds,
        { animalType: "", breed: "", status: "Available", price: 0, description: "" },
      ],
    }));
  };

  // Remove a breed
  const removeBreed = (index) => {
    setForm((prev) => ({
      ...prev,
      breeds: prev.breeds.filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate latitude and longitude
    const lat = parseFloat(form.latitude);
    const lon = parseFloat(form.longitude);
    if (isNaN(lat) || isNaN(lon)) {
      toast.error("Please enter valid latitude and longitude values.");
      return;
    }

    try {
      const updates = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        profile: form.profile,
        role: form.role,
        portfolio: form.portfolio,
        breeds: form.breeds,
        statistics: form.statistics,
      };

      if (locationUpdated || (form.latitude && form.longitude)) {
        updates.location = {
          type: "Point",
          coordinates: [lon, lat],
        };
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/edit-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated successfully!");
        navigate("/profile");
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating.");
    }
  };

  // Handle location update
  const handleLocationUpdate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setForm((prevForm) => ({
            ...prevForm,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
          }));
          setLocationUpdated(true);
          toast.success("Location updated successfully!");
        },
        (error) => {
          console.error(error);
          toast.error("Unable to retrieve your location.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 mt-[60px] flex items-center justify-center py-12">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={form.name} onChange={handleInputChange} placeholder="Name" className="w-full border p-2 rounded-md" required />
          <input type="email" name="email" value={form.email} onChange={handleInputChange} placeholder="Email" className="w-full border p-2 rounded-md" required />
          <input type="text" name="phone" value={form.phone} onChange={handleInputChange} placeholder="Phone" className="w-full border p-2 rounded-md" required />
          <label className="block text-gray-700 text-sm font-bold mb-2">Statistics</label>
          <label className="block text-gray-700 text-sm font-bold mb-2">Successful Breeds</label>
          <input type="number" name="successfulBreeds" value={form.statistics.successfulBreeds} onChange={handleInputChange} placeholder="Successful Breeds" className="w-full border p-2 rounded-md" />
          <label className="block text-gray-700 text-sm font-bold mb-2">Years of Experience</label>
          <input type="number" name="yearsExperience" value={form.statistics.yearsExperience} onChange={handleInputChange} placeholder="Years of Experience" className="w-full border p-2 rounded-md" />
          <label className="block text-gray-700 text-sm font-bold mb-2">Customer Satisfaction</label>
          <input type="number" name="customerSatisfaction" value={form.statistics.customerSatisfaction} onChange={handleInputChange} placeholder="Customer Satisfaction" className="w-full border p-2 rounded-md" />
          <label className="block text-gray-700 text-sm font-bold mb-2">Profile Image</label>
          <input type="text" name="profile" value={form.profile} onChange={handleInputChange} placeholder="Profile Image URL" className="w-full border p-2 rounded-md" />
          <div><img src={form.profile} alt="Profile" className="w-10 h-10 rounded-full" /></div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Portfolio Link</label>
          <input type="text" name="portfolio" value={form.portfolio} onChange={handleInputChange} placeholder="Portfolio Link" className="w-full border p-2 rounded-md" />
<div className="text-center items-center flex justify-center shadow-md"><img src={form.portfolio} alt="Profile" className="w-[60%] h-[30%] text-center items-center flex justify-center" /></div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Latitude</label>
            <input
              type="number"
              step="any" // Allows decimal values for latitude
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter latitude"
              name="latitude"
              onChange={changeVal}
              value={form.latitude}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Longitude</label>
            <input
              type="number"
              step="any" // Allows decimal values for longitude
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter longitude"
              name="longitude"
              onChange={changeVal}
              value={form.longitude}
            />
          </div>

          {/* Breeds Section */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Breeds</label>
            <button type="button" onClick={addBreed} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">+ Add Breed</button>
            {form.breeds.map((breed, index) => (
              <div key={index} className="flex gap-2 items-center border p-2 rounded-md mt-2">
                <input type="text" placeholder="Animal Type" value={breed.animalType} onChange={(e) => handleBreedChange(index, "animalType", e.target.value)} className="border p-2 rounded-md flex-1" />
                <input type="text" placeholder="Breed Name" value={breed.breed} onChange={(e) => handleBreedChange(index, "breed", e.target.value)} className="border p-2 rounded-md flex-1" />
                <button onClick={() => removeBreed(index)} className="text-red-500 hover:text-red-700">✖</button>
              </div>
            ))}
          </div>

          {/* Location Update */}
          <button type="button" onClick={handleLocationUpdate} className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Update Location</button>

          {/* Submit */}
          <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

{/*
  import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const fetchDetails = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        navigate('/login')
      } else {
        // If HTTP status is not OK, throw an error
        throw new Error("Failed to register. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }

  const handleValues = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Create an Account</h2>
          <p className="text-sm text-gray-600">Enter your details to register</p>
        </div>
        <form className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full border-gray-300 rounded-md p-1 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Doe"
              value={form.name}
              onChange={handleValues}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full border-gray-300 rounded-md p-1 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleValues}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              value={form.password}
              onChange={handleValues}
            />
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              fetchDetails();
            }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
*/}

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "owner",
    location: { coordinates: [] }, // Default empty array for coordinates
    profile: "",
  });

  // Get the user's current location using Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm((prevForm) => ({
            ...prevForm,
            location: {
              coordinates: [position.coords.longitude, position.coords.latitude], // [longitude, latitude]
            },
          }));
        },
        (error) => {
          toast.error("Unable to fetch location.");
          console.error(error);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Handle the change in the profile image URL input
  const handleProfileUrlChange = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      profile: e.target.value, // Store the URL entered by the user
    }));
  };

  const fetchDetails = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      localStorage.getItem('userName',data.name)
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        throw new Error(data.message || "Failed to register. Please try again.");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
      console.error("Error during registration:", error);
    }
  };

  const handleValues = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Create an Account</h2>
          <p className="text-sm text-gray-600">Enter your details to register</p>
        </div>
        <form className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full border-gray-300 rounded-md p-1 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Doe"
              value={form.name}
              onChange={handleValues}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full border-gray-300 rounded-md p-1 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleValues}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              value={form.password}
              onChange={handleValues}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <div className="flex gap-4 mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="owner"
                  checked={form.role === "owner"}
                  onChange={handleValues}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Owner</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="sitter"
                  checked={form.role === "sitter"}
                  onChange={handleValues}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Sitter</span>
              </label>
            </div>
          </div>
          {/* Profile Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Image URL</label>
            <input
              type="text"
              placeholder="https://example.com/profile.jpg"
              value={form.profile}
              onChange={handleProfileUrlChange}
              className="mt-1 block w-full text-sm text-gray-700 border-gray-300 rounded-md p-1 focus:ring-blue-500 focus:border-blue-500"
            />
            {form.profile && (
              <div className="mt-2">
                <img
                  src={form.profile}
                  alt="Profile preview"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              fetchDetails();
            }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

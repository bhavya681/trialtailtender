import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {

  const [form, setForm] = useState({ email: '', password: '' });

  const navigate = useNavigate();

  const fetchDetails = async (e) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Login successful');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', data.user.role); 
        localStorage.setItem('userName', data.user?.name);
        localStorage.setItem('userId', data.user?._id);
        localStorage.setItem('userDetails', JSON.stringify(data.user)); // Corrected
      
        navigate('/'); 
        window.location.reload();
      } else {
        throw new Error(data.message || 'Failed to log in. Please try again.');
      }

    } catch (error) {
      console.log(error);
    }
  }

  const handleValues = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value
    }));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Login</h2>
          <p className="text-sm text-gray-600">Enter your credentials to access your account</p>
        </div>
        <form className="space-y-4 mt-6" onSubmit={(e) => {
          e.preventDefault()
          fetchDetails();
        }}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleValues}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              value={form.password}
              onChange={handleValues}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Sign in
          </button>
        </form>
        <div className="flex justify-between mt-4 text-sm">
          <Link to="/register" className="text-blue-600 hover:underline">
            Create an account
          </Link>
          <Link to="/change-password" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}

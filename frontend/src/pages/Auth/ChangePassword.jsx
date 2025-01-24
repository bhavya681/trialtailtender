import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function ChangePassword() {

  const [form, setForm] = useState({ currentPassword: "", newPassword: "", email: "" });
const navigate=useNavigate();
  const fetchDetails = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: form.email, currentPassword: form.currentPassword, newPassword: form.newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('successfully changed password');
        navigate('/login');
      } else {
        toast.error(data.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error(error);
    }
  }

  const changeStuff = (e) => {
    setForm((prevForm) => ({ ...prevForm, [e.target.name]: e.target.value }));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Change Password</h2>
          <p className="text-sm text-gray-600">Enter your current password and a new password</p>
        </div>
        <form className="space-y-4 mt-6" onSubmit={fetchDetails}>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
             Enter Email
            </label>
            <input
              id="email"
              name="email"
              type="text"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              value={form.email}
              onChange={changeStuff}
            />
          </div>
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              value={form.currentPassword}
              onChange={changeStuff}
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              value={form.newPassword}
              onChange={changeStuff}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Change Password
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

// RegisterSitter.js
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const RegisterSitter = () => {


  const [form, setForm] = useState({
    name: '', email: '', experience: '', hourlyRate: '',paymentLink:''
  });
const navigate=useNavigate();
  const submitCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/sitters/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: form.name, email: form.email, experience: form.experience, hourlyRate: form.hourlyRate,paymentLink:form.paymentLink})
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Successfully Registered Sitter');
        navigate('/sitterlist');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <div className="container mx-auto py-8 mt-20">
      <section className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Register a New Sitter</h2>
        <form onSubmit={submitCreate} className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="name" className="block text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter sitter's name"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="age" className="block text-gray-700">Experience</label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter year of expierence"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter sitter's email"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="paymentLink" className="block text-gray-700">Enter Payment Recieve Link</label>
              <input
                type="text"
                id="paymentLink"
                name="paymentLink"
                value={form.paymentLink}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter sitter's paymentLink [Where you will recieve payment]"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="phone" className="block text-gray-700">Hourly Rate</label>
              <input
                type="number"
                id="hourlyRate"
                name="hourlyRate"
                value={form.hourlyRate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter amount charge per hour"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Register
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default RegisterSitter;

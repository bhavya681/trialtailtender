import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddPet = () => {
  {/*
  breed: {
    type: String,
    required: [true, 'Pet breed is required'],
  },
  pic: {
    type: String,
    required: [true, 'Pet Pic is required'],
  },
  */}
  const [form, setForm] = useState({
    name: '', type: '', age: '', breed: '', pic: ''
  });
  const navigate = useNavigate();
  const fetchPets = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: form.name, type: form.type, age: form.age, breed: form.breed, pic: form.pic })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Successfully Added Pet');
        navigate('/petslist');
      } else {
        toast.error(data.message || 'Failed to add pet');
      }
    } catch (error) {
      toast.error(error)
    }
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (<>
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mt-16">Add New Pet</h1>
      <form className="max-w-lg mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-14" onSubmit={fetchPets}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Pet Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter pet's name"
            value={form.name}
            onChange={handleChange}
            name='name'
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
            Pet Type
          </label>
          <input
            id="type"
            type="text"
            name='type'
            placeholder="Enter pet type (e.g., Dog, Cat)"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-500"
            value={form.type}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
            Breed Type
          </label>
          <input
            id="breed"
            type="text"
            name='breed'
            placeholder="Enter pet Breed"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-500"
            value={form.breed}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
            Pet Profile Picture
          </label>
          <input
            id="pic"
            type="text"
            name='pic'
            placeholder="Enter link of pet picture (e.g., Dog, Cat)"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-500"
            value={form.pic}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
            Pet Age
          </label>
          <input
            id="age"
            type="number"
            name='age'
            placeholder="Enter pet's age"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-500"
            value={form.age}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-700 w-full"
        >
          Add Pet
        </button>
      </form>
    </div>
  </>);
};

export default AddPet;

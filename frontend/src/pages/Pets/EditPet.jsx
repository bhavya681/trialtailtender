import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const EditPet = () => {
{/*
  breed: {
    type: String,
    required: [true, 'Pet breed is required'],
  },
  pic: {
    type: String,
    required: [true, 'Pet Pic is required'],
  },
  age: {
    type: Number,
    required: [true, 'Pet age is required'],
  },
  */}
  const [form, setForm] = useState({
   name: '', type: '', age: '', breed: '', pic: ''
  });

  const params = useParams();
  const fetchPets = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pets/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
   
      setForm({
        name: data.name,
        type: data.type,
        age: data.age,
         breed: data.breed, pic:data.pic
      });
    } catch (error) {
      console.log(error);
    }
  }
  const handleCHnage = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  const navigate = useNavigate();
  const updatePets = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pets/edit/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: form.name, type: form.type, age: form.age, breed: form.breed, pic:form.pic })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Successfully Updated');
        navigate('/petslist');
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchPets();
  }, []);



  return (<>
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mt-16">Edit Pet Details</h1>
      <form onSubmit={updatePets} className="max-w-lg mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Pet Name
          </label>
          <input
            id="name"
            type="text"
            name='name'
            value={form.name}
            onChange={handleCHnage}
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
            value={form.type}
            onChange={handleCHnage}
          
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-500"
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
            onChange={handleCHnage}
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
            onChange={handleCHnage}
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
            value={form.age}
            onChange={handleCHnage}
        
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-700 w-full"
        >
          Save Changes
        </button>
      </form>
    </div>
  </>);
};

export default EditPet;

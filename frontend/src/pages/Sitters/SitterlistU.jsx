// SitterList.js
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const SitterlistU = () => {

  const [sitters, setSitters] = useState([]);

  const fetchSitter = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/sitters/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSitters(data.sitters);

      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchSitter();
  }, [sitters]);

  const deleteStuff = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/sitters/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Successfully Deleted');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <section className="bg-white p-6 rounded-lg shadow-lg">
        <div className='flex justify-between p-1 m-1'>
          <h2 className="text-2xl font-semibold mb-4">Sitter List</h2>
          <Link
            to={`/sitterdetails`}
            className="items-center p-2 mb-4 gap-2 bg-yellow-600 text-white  rounded-lg shadow-lg transition hover:bg-blue-700 hover:shadow-xl"
          >
            <span className="text-lg font-medium">View All Sitters</span>

          </Link>
        </div>
        <div className="overflow-x-auto">
          <Link
            to={`/registersitter`}
            className="flex items-center p-2 flex justify-between mb-4 gap-2 bg-blue-600 text-white  rounded-lg shadow-lg transition hover:bg-blue-700 hover:shadow-xl"
          >
            <span className="text-lg font-medium">Create New Sitters</span>
            <span className="text-4xl font-medium pb-2">+</span>
          </Link>  <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-2 text-left">Name</th>
                <th className="px-6 py-2 text-left">Experience</th>
                <th className="px-6 py-2 text-left">Email</th>
                <th className="px-6 py-2 text-left">Hourly Rate</th>
                {/* <th className='px-6 py-2 text-left'>Payment Link</th> */}
              </tr>
            </thead>
            <tbody>
              {sitters.map((sitter) => (
                <>
                  <tr key={sitter._id} className="border-t">
                    <td className="px-6 py-4">{sitter.name}</td>
                    <td className="px-6 py-4">{sitter.experience}</td>
                    <td className="px-6 py-4">{sitter.email}</td>
                    <td className="px-6 py-4">{sitter.hourlyRate}</td>
                    {/* <td className='px-6 py-4'><a href={sitter?.paymentLink}>Payment</a></td> */}
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default SitterlistU;

// SitterList.js
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const SitterList = () => {

  const [sitters, setSitters] = useState([]);
  const [id, setId] = useState('');
  const storedSitterName = localStorage.getItem('userName'); // Fetch the sitter name from localStorage

  useEffect(() => {
    const fetchSitters = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/sitters`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        if (data.success) {
        
          setSitters(data.sitters);

          // Find the sitter with the matching name
          const matchingSitter = data.sitters.find(sitter => sitter.name === storedSitterName);

          if (matchingSitter) {
     
            setId(matchingSitter._id); // Store the matching sitter's ID
          } else {
            console.log('No matching sitter found');
          }
        }
      } catch (error) {
        console.log('Error fetching sitters:', error);
      }
    };

    fetchSitters();
  }, [storedSitterName]);

  useEffect(() => {
    if (id) {
      const fetchSitter = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/sitters/sitter/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const data = await res.json();
          if (data.success) {
            setSitters(data.sitter)
          
          }
        } catch (error) {
          console.log('Error fetching sitter by ID:', error);
        }
      };

      fetchSitter();
    }
  }, [id]);

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

  return (<>

    <div className="max-w-7xl mt-8 mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <section className="bg-gradient-to-r from-blue-50 via-white to-purple-50 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4 mb-8'>
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent p-1 bg-gradient-to-r from-blue-600 to-purple-600">
              Sitter Management
            </h2>
            <Link
              to={`/sitterdetails`}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 transform"
            >
              <span className="text-lg font-semibold">View All Sitters</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          <Link
            to={`/registersitter`}
            className="group flex items-center justify-between w-full p-4 mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] transform"
          >
            <span className="text-xl font-semibold">Add New Sitter</span>
            <div className="h-10 w-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300">
              <span className="text-2xl font-bold">+</span>
            </div>
          </Link>

          <div className="overflow-x-auto rounded-xl shadow-inner bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Experience</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Hourly Rate</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr key={sitters._id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sitters.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sitters.experience} years</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sitters.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${sitters.hourlyRate}/hr</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                    <Link to={`/editsitter/${sitters._id}`}>
                      <button className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit
                      </button>
                    </Link>
                    <button 
                      onClick={() => { deleteStuff(sitters._id) }} 
                      className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default SitterList;

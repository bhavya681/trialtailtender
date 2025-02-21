// import React, { useState } from 'react';
// import toast from 'react-hot-toast';
// import { useNavigate, useParams } from 'react-router-dom';

// const CreateReview = () => {
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState('');
// const navigate=useNavigate();
//   const params = useParams();
//   const userId = localStorage.getItem('userId');
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`http://localhost:5000/api/reviews/${params.id}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({ ownerId: userId, sitterId: params.id, rating, comment }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         toast.success('Review created successfully!');
//         navigate('/booklist')
//       } else {
//         toast.error(data.message || 'Failed to create review');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('An error occurred while creating the review.');
//     }
//   };

//   return (
//     <div className="container mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-2xl font-bold mb-4">Create Review</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label htmlFor="rating" className="block font-semibold mb-2">
//             Rating (1-5):
//           </label>
//           <input
//             type="number"
//             id="rating"
//             value={rating}
//             onChange={(e) => setRating(e.target.value)}
//             min="1"
//             max="5"
//             className="w-full border px-4 py-2 rounded-lg"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="comment" className="block font-semibold mb-2">
//             Comment:
//           </label>
//           <textarea
//             id="comment"
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             className="w-full border px-4 py-2 rounded-lg"
//             required
//           ></textarea>
//         </div>
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
//         >
//           Submit Review
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateReview;


import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const CreateReview = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  const params = useParams();
  const userId = localStorage.getItem('userId');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ownerId: userId, sitterId: params.id, rating, comment }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Review created successfully!');
        navigate('/booklist');
      } else {
        toast.error(data.message || 'Failed to create review');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while creating the review.');
    }
  };

  return (
    <div className="container mt-[80px] p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create Review</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Rating:</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                onClick={() => setRating(star)}
                size={30}
              />
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="comment" className="block font-semibold mb-2">Comment:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default CreateReview;

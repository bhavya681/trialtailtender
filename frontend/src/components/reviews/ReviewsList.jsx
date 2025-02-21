import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { BiCommentEdit } from "react-icons/bi";
import { FaDeleteLeft } from "react-icons/fa6";
import { FaStar } from 'react-icons/fa'

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const params = useParams();
  const userName = localStorage.getItem('userName');
  const [comingUserName, setComingUserName] = useState('');
  // Fetch reviews for a specific sitter
  const fetchReviews = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });
      const data = await response.json();
      if (response.ok) {
        setReviews(data);
      } else {
        toast.error(data.message || 'Failed to fetch reviews');
      }
      console.log(reviews);
      setComingUserName(reviews);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while fetching reviews.');
    }
  };
  useEffect(() => {
    fetchReviews();
  }, [])
  // Delete a review by its ID
  const deleteReview = async (reviewId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });
      if (response.ok) {
        toast.success('Review deleted successfully!');
        fetchReviews(); // Refresh the list after deletion
      } else {
        toast.error('Failed to delete review');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while deleting the review.');
    }
  };

  return (
    <>
      <div className="container mx-auto my-10 p-6 mt-20 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-8">User Reviews</h2>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review?._id}
              className="p-5 border border-gray-200 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center transition-transform transform hover:scale-105"
            >
              <div className="flex-grow">
                <p className="font-semibold text-xl mb-1">
                  Rating:
                  <span className="flex text-yellow-500 ml-2">
                    {Array.from({ length: review?.rating }).map((_, index) => (
                      <FaStar key={index} />
                    ))}
                  </span>
                </p>
                <p className="text-gray-700 text-base">{review?.comment}</p>
                <b>Reviewer: {review?.ownerId?.name}</b>
              </div>


              {review.ownerId.name === userName
                ?
                (<>
                  <div className="mt-4 md:mt-0 flex space-x-3">
                    <Link
                      to={`/edit/review/${review?._id}/${params.id}`}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center"
                    >
                      <BiCommentEdit className="mr-1" />
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteReview(review?._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 flex items-center"
                    >
                      <FaDeleteLeft className="mr-1" />
                      Delete
                    </button>
                  </div>
                </>)
                :
                (
                  <>


                  </>
                )
              }
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ReviewsList;

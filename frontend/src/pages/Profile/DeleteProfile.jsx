
const DeleteProfile = () => {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-md rounded-lg p-6 w-96">
          <h2 className="text-xl font-bold mb-4 text-center text-red-500">Delete Profile</h2>
          <p className="text-gray-800 text-center mb-6">
            Are you sure you want to delete your profile? This action cannot be undone.
          </p>
          <div className="flex justify-between">
            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Cancel
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default DeleteProfile
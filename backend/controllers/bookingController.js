// import Booking from '../models/Booking.js';

// // Create a new booking
// export const createBooking = async (req, res) => {
//   try {
//     const booking = new Booking({
//       ...req.body,
//       owner: req.user.id,
//       sitter:req.user.id,
//       status: 'pending',  // Initially, the status is 'pending'
//       createdAt: new Date(),  // Timestamp of booking
//     });
//     await booking.save();
//     res.status(201).json({ message: 'Booking created successfully', booking ,success:true});
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get all bookings for the logged-in owner
// export const getBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find({ owner: req.user.id })
//       .populate('owner', 'name email') // Populates owner with only name and email
//       .populate('approvedBy', 'name email'); // Populates approvedBy with only name and email

//     res.status(200).json({ bookings, success: true });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// // Get booking details by ID
// export const getBookingDetails = async (req, res) => {
//   try {
//     // Retrieve the booking by its ID from the database
//     const booking = await Booking.findById(req.params.id);

//     // Check if the booking exists
//     if (!booking) {
//       return res.status(404).json({ error: 'Booking not found' });
//     }

//     // Ensure the logged-in user owns the booking
//     if (booking.owner.toString() !== req.user.id) {
//       return res.status(403).json({ error: 'Access denied. You do not own this booking.' });
//     }

//     res.status(200).json({booking,success:true}); // Send the booking details
//   } catch (error) {
//     // Handle invalid ID format or other errors
//     if (error.name === 'CastError') {
//       return res.status(400).json({ error: 'Invalid booking ID' });
//     }
//     res.status(500).json({ error: error.message });
//   }
// };


// // Update booking details (e.g., change start and end dates)
// export const updateBooking = async (req, res) => {
//   try {
//     const { startDate, endDate,notes } = req.body;
//     const booking = await Booking.findByIdAndUpdate(
//       req.params.id,
//       { startDate, endDate,notes },
//       { new: true }
//     );

//     if (!booking) {
//       return res.status(404).json({ error: 'Booking not found' });
//     }

//     res.status(200).json({ message: 'Booking updated successfully', booking,success:true });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Confirm the booking (set the status to 'confirmed')
// export const confirmBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findByIdAndUpdate(
//       req.params.id,
//       { status: 'confirmed' },  // Mark as confirmed
//       { new: true }
//     );

//     if (!booking) {
//       return res.status(404).json({ error: 'Booking not found' });
//     }

//     res.status(200).json({ message: 'Booking confirmed successfully', booking });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Delete (cancel) booking
// export const deleteBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findByIdAndDelete(req.params.id);
//     if (!booking) {
//       return res.status(404).json({ error: 'Booking not found' });
//     }
//     res.status(200).json({ message: 'Booking cancelled successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


import Booking from '../models/Booking.js';

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { serviceType, startDate, endDate, notes, sitterId, pets } = req.body;

    // Validate that pets array is provided and not empty
    if (!pets || pets.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one pet must be selected' });
    }

    const booking = new Booking({
      owner: req.user.id,
      sitter: sitterId,
      pets, // Include selected pets
      status: 'pending',
      startDate,
      endDate,
      notes,
      serviceType,
      createdAt: new Date(),
    });

    await booking.save();
    res.status(201).json({ message: 'Booking created successfully', booking, success: true });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

// export const createBooking = async (req, res) => {
//   try {
//     const { serviceType, startDate, endDate, notes, sitterId } = req.body;

//     const booking = new Booking({
//       owner: req.user.id,
//       sitter: sitterId,  // This expects sitterId, which is passed from the frontend
//       status: 'pending',
//       startDate,
//       endDate,
//       notes,
//       serviceType,
//       createdAt: new Date(),
//     });

//     await booking.save();
//     res.status(201).json({ message: 'Booking created successfully', booking, success: true });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// Get all bookings for the logged-in owner
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user.id })
      .populate('owner', 'name email') // Populates owner with only name and email
      .populate('sitter', 'name email paymentLink id') // Populates sitter with only name and email
      .populate('approvedBy', 'name email') // Populates approvedBy with only name and email
      .populate('pets', 'name');
    res.status(200).json({ bookings, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get booking details by ID
export const getBookingDetails = async (req, res) => {
  try {
    // Retrieve the booking by its ID from the database
    const booking = await Booking.findById(req.params.id);

    // Check if the booking exists
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Ensure the logged-in user owns the booking
    if (booking.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. You do not own this booking.' });
    }

    res.status(200).json({ booking, success: true }); // Send the booking details
  } catch (error) {
    // Handle invalid ID format or other errors
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid booking ID' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Update booking details (e.g., change start and end dates)
export const updateBooking = async (req, res) => {
  try {
    const { startDate, endDate, notes, serviceType, sitterId, pets } = req.body;

    // Validate that pets array is provided and not empty
    if (!pets || pets.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one pet must be selected' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        startDate,
        endDate,
        notes,
        serviceType,
        sitter: sitterId,
        pets, // Update pets
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking updated successfully', booking, success: true });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

// export const updateBooking = async (req, res) => {
//   try {
//     const { startDate, endDate, notes, serviceType, sitterId } = req.body;
//     const booking = await Booking.findByIdAndUpdate(
//       req.params.id,
//       { startDate, endDate, notes, serviceType, sitterId }, // Include serviceType
//       { new: true }
//     );

//     if (!booking) {
//       return res.status(404).json({ error: 'Booking not found' });
//     }

//     res.status(200).json({ message: 'Booking updated successfully', booking, success: true });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const editStatus = async (req, res) => {
  try {
    const { status } = req.body; // Extract the status from the request body
    const { id } = req.params;  // Extract the booking ID from the route parameters

    // Validate status
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    // Update booking with new status
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status }, // Update only the status field
      { new: true } // Return the updated document
    );

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: 'Booking Not Found' });
    }

    return res.status(200).json({ success: true, message: 'Status updated successfully', booking: updatedBooking });
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};





// Confirm the booking (set the status to 'confirmed')
export const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'confirmed' }, // Mark as confirmed
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking confirmed successfully', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete (cancel) booking
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




export const getSitterBookings = async (req, res) => {
  try {
    const { id: sitterId } = req.params; // Extract the sitter ID from the URL

    if (!sitterId) {
      return res.status(400).json({ success: false, error: 'Sitter ID is required' });
    }

    // Fetch bookings for the given sitter ID
    const bookings = await Booking.find({ sitter: sitterId })
      .populate('owner', 'name email profile') // Populate owner field with name and email
      .populate('sitter', 'name email reviews') // Populate sitter field with name and email
      .populate('pets','name type')
      .populate('approvedBy', 'name email'); // Populate approvedBy field with name and email

    if (!bookings.length) {
      return res.status(404).json({ success: false, error: 'No bookings found for this sitter' });
    }

    res.status(200).json({ bookings, success: true });
  } catch (error) {
    console.error('Error fetching sitter bookings:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


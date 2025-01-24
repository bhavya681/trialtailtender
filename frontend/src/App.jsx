import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ChangePassword from "./pages/Auth/ChangePassword";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import AddBooking from "./pages/Bookings/AddBooking";
import BookingList from "./pages/Bookings/BookingList";
import EditBooking from "./pages/Bookings/EditBooking";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddPet from "./pages/Pets/AddPet";
import EditPet from "./pages/Pets/EditPet";
import PetsList from "./pages/Pets/PetsList";
import ChatBot from "./pages/Chatbot/ChatBot";
import UserProfile from "./pages/Profile/UserProfile";
import EditProfile from "./pages/Profile/EditProfile";
import DeleteProfile from "./pages/Profile/DeleteProfile";
import RegisterSitter from "./pages/Sitters/RegisterSitter";
import SitterDetails from "./pages/Sitters/SitterDetails";
import SitterList from "./pages/Sitters/SitterList";
import Header from "./components/Header";
import toast, { Toaster } from 'react-hot-toast';
import PageNot from "./components/PageNot";
import EditSitter from "./pages/Sitters/EditSitter";
import SitterlistU from "./pages/Sitters/sitterlistU";
import EditStatus from "./pages/Sitters/EditStatus";
import SitterBookingList from "./pages/Sitters/SitterBookinglist";
import OwnersList from "./pages/Sitters/OwnersList";
import ChatBox from "./components/ChatBox";
import Favourites from "./pages/Sitters/Favourites";
import ReviewsList from "./components/reviews/ReviewsList";
import UpdateReview from "./components/reviews/UpdateReview";
import CreateReview from "./components/reviews/CreateReview";
import SitterProfile from "./pages/Sitters/SitterProfile";

const App = () => {
  const auth = localStorage.getItem('token');

  return (
    <>
      <Router>
        <Header />
        <Routes>
          {auth ? (<>
            <Route path="/editbook/:id" element={<EditBooking />} />
            <Route path="/book" element={<AddBooking />} />
            <Route path="/booklist" element={<BookingList />} />
            <Route path="/pet" element={<AddPet />} />
            <Route path="/editpet/:id" element={<EditPet />} />
            <Route path="/petslist" element={<PetsList />} />
            <Route path="/chatbot" element={<ChatBot />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/editprofile/:id" element={<EditProfile />} />
            <Route path="/deleteprofile" element={<DeleteProfile />} />
            <Route path="/registersitter" element={<RegisterSitter />} />
            <Route path="/sitterdetails" element={<SitterDetails />} />
            <Route path="/sitterlist" element={<SitterList />} />
            <Route path="/editsitter/:id" element={<EditSitter />} />
            <Route path="/edit-status/:id" element={<EditStatus />} />
            <Route path="/sitter-bookings" element={<SitterBookingList />} />
            <Route path="/" element={<Home />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<PageNot />} />
            {/* <Route path="/sitterlistU" element={<SitterlistU />} /> */}
            <Route path="/sitterlistU" element={<SitterDetails />} />
            <Route path="/ownersList" element={<OwnersList />} />
            <Route path="/chat/:chatId" element={<ChatBox />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/reviews/:id" element={<ReviewsList />} />
            <Route path="/edit/review/:reviewid/:sitterid" element={<UpdateReview />} />
            <Route path="/add/review/:id" element={<CreateReview />} />
            <Route path="/sitter/profile/:userSitterId/:sitterId" element={<SitterProfile/>} />
          </>)
            :
            (<>
              <Route path="/" element={<Home />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<PageNot />} />
            </>)}
          <Route path="/" element={<Home />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<PageNot />} />
        </Routes>
        <Toaster />
        <Footer />
      </Router>
    </>
  );
};
export default App;
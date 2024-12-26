import React from 'react';
import HotelList from './components/HotelList';
import HotelReviews from './components/HotelReviews';
import RoomList from './components/RomList';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import AddHotel from './components/AddHotel';
import AddRoom from './components/AddRoom';
import BookingRoom from './components/BookingRoom';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HotelList />} />
                <Route path="/hotel/:id/reviews" element={<HotelReviews />} />
                <Route path="/hotel/:id/rooms" element={<RoomList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/add-hotel" element={<AddHotel />} />
                <Route path="/add-room:id" element={<AddRoom />} />
                <Route path="/booking-room/:roomId" element={<BookingRoom />} />
            </Routes>
        </Router>
    );
}

export default App;
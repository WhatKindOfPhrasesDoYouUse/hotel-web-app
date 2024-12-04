import React from 'react';
import HotelList from './components/HotelList';
import HotelReviews from './components/HotelReviews';
import RoomList from './components/RomList';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HotelList />} />
                <Route path="/hotel/:id/reviews" element={<HotelReviews />} />
                <Route path="/hotel/:id/rooms" element={<RoomList />} />
            </Routes>
        </Router>
    );
}

export default App;
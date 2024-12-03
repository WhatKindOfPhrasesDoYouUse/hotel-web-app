import React from 'react';
import HotelList from './components/HotelList';
import HotelReviews from './components/HotelReviews';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HotelList />} />
                <Route path="/hotel/:id/reviews" element={<HotelReviews />} />
            </Routes>
        </Router>
    );
}

export default App;
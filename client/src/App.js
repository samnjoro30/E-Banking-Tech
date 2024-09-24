import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Home from './pages/Home';

// Other imports

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/register" element={<Register />} />
                {/* Other routes */}
            </Routes>
        </Router>
    );
};

export default App;

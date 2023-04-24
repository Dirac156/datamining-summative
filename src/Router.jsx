import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing';

function RouterComponent() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/music" element={<MusicRecommender />} /> */}
      </Routes>
    </BrowserRouter>
  );
}


export default RouterComponent;
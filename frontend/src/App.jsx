import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import QueuePage from './pages/QueuePage';
import AdminPage from './pages/AdminPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/queue" replace />} />
            <Route path="/queue" element={<QueuePage />} />
            <Route path="/admin" element={<AdminPage />} />
        </Routes>
    );
}

export default App;

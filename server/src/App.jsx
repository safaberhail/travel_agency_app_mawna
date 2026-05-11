import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddTrip from './pages/AddTrip';

// مكون الصفحة الرئيسية
const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
    <h1 className="text-5xl font-bold text-blue-900 mb-6">مرحباً بك في وكالة السفر</h1>
    <p className="text-xl text-gray-600 mb-10">اكتشف رحلاتنا الحصرية بأفضل الأسعار</p>
    
    <Link 
      to="/admin/add-trip" 
      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition"
    >
      إضافة رحلة جديدة (للمسؤول)
    </Link>
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/add-trip" element={<AddTrip />} />
      </Routes>
    </div>
  );
}

export default App;
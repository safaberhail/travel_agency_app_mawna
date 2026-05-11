import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TripCard = ({ trip }) => {
  const navigate = useNavigate();
  
  // فحص هل المستخدم هو المدير
  const isAdmin = localStorage.getItem('adminToken') !== null;

  const handleDelete = async (e) => {
    e.stopPropagation(); // منع الانتقال لصفحة التفاصيل عند الضغط على الحذف
    if (window.confirm("⚠️ هل أنت متأكد من حذف هذه الرحلة نهائياً؟")) {
      try {
        await axios.delete(`http://localhost:5001/api/trips/${trip._id}`);
        window.location.reload(); 
      } catch (err) {
        alert("فشل الحذف");
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-100 relative group">
      
      {/* 🔒 زر الحذف يظهر فقط إذا كان المستخدم مديراً */}
      {isAdmin && (
        <button 
          onClick={handleDelete}
          className="absolute top-3 left-3 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          title="حذف الرحلة"
        >
          🗑️
        </button>
      )}

      <img 
        src={`https://travel-agency-app-mawna-3.onrender.com/${trip.image}`} 
        alt={trip.title} 
        className="w-full h-56 object-cover"
      />
      
      <div className="p-5 text-right flex flex-col" dir="rtl">
        <div className="flex justify-between items-center mb-2">
            <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-lg">{trip.category}</span>
            <span className="text-gray-400 text-xs">⏱️ {trip.duration}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">{trip.title}</h3>
        
        <div className="mt-auto border-t pt-4 flex justify-between items-center">
          <div>
            <span className="text-xl font-black text-blue-600">{trip.price.toLocaleString()}</span>
            <span className="text-gray-500 text-xs font-bold mr-1">د.ج</span>
          </div>
          <button 
            onClick={() => navigate(`/trip/${trip._id}`)}
            className="bg-gray-800 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition shadow-md"
          >
            عرض التفاصيل
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
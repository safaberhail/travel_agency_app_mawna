import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import TripCard from '../components/TripCard';

const Home = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/api/trips`)
      .then(res => {
        setTrips(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* قسم الترحيب - الهيدر */}
      <header className="bg-blue-600 py-20 text-white text-center shadow-lg">
        <h1 className="text-5xl font-black mb-4">اكتشف وجهتك القادمة ✈️</h1>
        {/* النص الجديد الذي طلبته */}
        <p className="text-xl opacity-90 font-medium max-w-2xl mx-auto leading-relaxed">
          وكالة ماونة للسياحة و السفر، مرافقة دائمة ... و خدمة تليق بضيوف الرحمان
        </p>
      </header>

      <main className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 border-r-4 border-blue-600 pr-4">آخر الرحلات المتوفرة</h2>
        {loading ? (
          <div className="text-center py-10 font-bold">جاري تحميل الرحلات...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {trips.map((trip) => <TripCard key={trip._id} trip={trip} />)}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
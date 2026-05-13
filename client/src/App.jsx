import React from 'react';
import { Routes, Route } from 'react-router-dom';

// استيراد المكونات والصفحات
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TripDetails from './pages/TripDetails';
import AddTrip from './pages/AddTrip';
import AdminManagement from './pages/AdminManagement';
import AddBookingManual from './pages/AddBookingManual';
import Login from './pages/Login';

// استيراد الإعدادات (هام جداً لمنع الصفحة البيضاء)
import { AGENCY_SETTINGS } from './agencyConfig';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-arabic text-right" dir="rtl">
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trip/:id" element={<TripDetails />} />
        <Route path="/admin/management" element={<AdminManagement />} />
        <Route path="/admin/add-trip" element={<AddTrip />} />
        <Route path="/admin/add-booking" element={<AddBookingManual />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      {/* فوتر الوكالة المخصص */}
      <footer className="bg-gray-900 text-white py-16 mt-24" id="footer">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-right">
          <div>
            <h3 className="text-2xl font-black mb-6 text-blue-400">{AGENCY_SETTINGS.name}</h3>
            <p className="text-gray-400 leading-relaxed">{AGENCY_SETTINGS.footerText}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-6">تواصل مباشر</h3>
            <ul className="space-y-4 text-gray-400">
              <li>📞 {AGENCY_SETTINGS.phone1}</li>
              <li>📞 {AGENCY_SETTINGS.phone2}</li>
              <li>💬 واتساب: {AGENCY_SETTINGS.whatsapp}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-6">العنوان</h3>
            <p className="text-gray-400">📍 {AGENCY_SETTINGS.address}</p>
            <p className="text-gray-400 mt-4 font-bold">🕒 أوقات الاستقبال:</p>
            <p className="text-gray-400 text-sm">{AGENCY_SETTINGS.workingHours}</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          جميع الحقوق محفوظة  - {AGENCY_SETTINGS.name}
        </div>
      </footer>
    </div>
  );
}

export default App;
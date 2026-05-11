import React from 'react';
import { Link } from 'react-router-dom';
import { AGENCY_SETTINGS } from '../agencyConfig';

const Navbar = () => {
  const isAdmin = localStorage.getItem('adminToken') !== null;

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50 font-arabic">
      <div className="container mx-auto flex justify-between items-center px-6">
        
        {/* اسم الوكالة من ملف Config */}
        <Link to="/" className="text-2xl font-black text-blue-600">{AGENCY_SETTINGS.name}</Link>

        <ul className="hidden md:flex items-center gap-x-8 font-bold text-gray-700 text-sm">
          <li><Link to="/" className="hover:text-blue-600 transition">الرئيسية</Link></li>
          
          {isAdmin ? (
            <>
              <li><Link to="/admin/management" className="hover:text-blue-600 transition">سجل المسافرين</Link></li>
              <li><Link to="/admin/add-trip" className="hover:text-blue-600 transition">إضافة رحلة</Link></li>
              <li><button onClick={handleLogout} className="bg-red-50 text-red-500 px-4 py-1 rounded-lg">خروج</button></li>
            </>
          ) : (
            <>
              <li><a href="#footer" className="hover:text-blue-600 transition">اتصل بنا</a></li>
              <li><Link to="/login" className="text-gray-300 text-[10px]">الإدارة</Link></li>
            </>
          )}
        </ul>

        {!isAdmin && (
          <div className="hidden md:block">
            <a href={`tel:${AGENCY_SETTINGS.phone1}`} className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold text-xs shadow-md hover:bg-orange-600 transition">
               اتصل بنا: {AGENCY_SETTINGS.phone1}
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
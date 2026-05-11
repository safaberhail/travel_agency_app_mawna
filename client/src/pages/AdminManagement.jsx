import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const AdminManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // حالات النوافذ المنبثقة
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [editData, setEditData] = useState({ passportNumber: '', paidAmount: 0 });

    // بيانات المسافر الجديد
    const [newTraveler, setNewTraveler] = useState({
        name: '', phone: '', tripId: '', passportNumber: '', paidAmount: 0, status: 'Pending'
    });

    const loadData = async () => {
        try {
            const [bRes, tRes] = await Promise.all([
                axios.get(`${API_URL}/api/bookings`),
                axios.get(`${API_URL}/api/trips`)
            ]);
            setBookings(bRes.data);
            setTrips(tRes.data);
            setLoading(false);
        } catch (err) {
            console.error("Error loading data:", err);
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    // --- منطق الحساب التلقائي للمسافر الجديد ---
    const selectedTrip = trips.find(t => t._id === newTraveler.tripId);
    const tripPrice = selectedTrip ? selectedTrip.price : 0;
    const remainingForNew = tripPrice - newTraveler.paidAmount;

    const handleAddTraveler = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/bookings`, newTraveler);
            alert("✅ تم تسجيل المسافر بنجاح");
            setShowAddModal(false);
            setNewTraveler({ name: '', phone: '', tripId: '', passportNumber: '', paidAmount: 0, status: 'Pending' });
            loadData();
        } catch (err) {
            alert("❌ فشل في إضافة المسافر");
        }
    };

    const handleConfirm = async (id) => {
        if (window.confirm("تأكيد الحجز سيقوم بخصم مقعد من الرحلة. هل أنت متأكد؟")) {
            await axios.patch(`${API_URL}/api/bookings/${id}`, { status: 'Confirmed' });
            loadData();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("حذف هذا السجل نهائياً؟")) {
            await axios.delete(`${API_URL}/api/bookings/${id}`);
            loadData();
        }
    };

    const handleUpdate = async () => {
        await axios.patch(`${API_URL}/api/bookings/${editingBooking._id}`, editData);
        setEditingBooking(null);
        loadData();
    };

    const filtered = bookings.filter(b => {
        const matchesF = filter === 'all' || b.status === filter;
        const matchesS = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.phone.includes(searchTerm);
        return matchesF && matchesS;
    });

    if (loading) return <div className="flex items-center justify-center min-h-screen font-black text-2xl text-blue-600 animate-pulse">جاري تحميل البيانات...</div>;

    return (
        <div className="container mx-auto py-12 px-6 text-right font-arabic" dir="rtl">
            
            {/* الهيدر الاحترافي */}
            <div className="bg-gradient-to-l from-blue-800 to-blue-600 p-10 rounded-[3rem] shadow-2xl mb-12 text-white flex flex-col md:flex-row justify-between items-center gap-6 border-b-8 border-blue-900">
                <div>
                    <h1 className="text-4xl font-black mb-3">سجل المسافرين والطلبات 📋</h1>
                    <p className="text-blue-100 font-medium">إدارة شاملة لرحلات وكالة ماونة فرع سدراتة</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-green-500 hover:bg-green-600 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-xl transition-all transform hover:scale-105 active:scale-95"
                >
                    + إضافة مسافر يدوياً
                </button>
            </div>

            {/* الفلاتر والبحث */}
            <div className="flex flex-col md:flex-row gap-6 mb-10 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                <input 
                    type="text" placeholder="ابحث باسم المسافر أو الهاتف..." 
                    className="flex-1 p-4 border-2 border-gray-50 bg-gray-50 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                    className="p-4 border-2 border-gray-50 bg-gray-50 rounded-2xl font-black text-blue-700 outline-none"
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">كل السجلات</option>
                    <option value="Pending">⌛ قيد الانتظار</option>
                    <option value="Confirmed">✅ مؤكدون</option>
                </select>
            </div>

            {/* الجدول */}
            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
                <table className="w-full text-right">
                    <thead className="bg-gray-800 text-white">
                        <tr className="text-sm">
                            <th className="p-6">المسافر / الهاتف</th>
                            <th className="p-6">الرحلة</th>
                            <th className="p-6">رقم الجواز</th>
                            <th className="p-6">المالية (د.ج)</th>
                            <th className="p-6 text-center">الحالة</th>
                            <th className="p-6 text-center">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filtered.map(b => (
                            <tr key={b._id} className="hover:bg-blue-50 transition-all">
                                <td className="p-6">
                                    <div className="font-black text-gray-800 text-lg">{b.name}</div>
                                    <div className="text-sm text-gray-400 font-bold">{b.phone}</div>
                                </td>
                                <td className="p-6 text-blue-700 font-black">{b.trip_title}</td>
                                <td className="p-6 font-bold text-gray-500">{b.passportNumber || '---'}</td>
                                <td className="p-6">
                                    <div className="text-green-600 font-black">مدفوع: {b.paidAmount?.toLocaleString()}</div>
                                    <div className="text-red-500 font-bold text-xs">الباقي: {b.remainingAmount?.toLocaleString()}</div>
                                </td>
                                <td className="p-6 text-center">
                                    <span className={`px-4 py-2 rounded-xl text-xs font-black ${b.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {b.status === 'Confirmed' ? 'مؤكد' : 'انتظار'}
                                    </span>
                                </td>
                                <td className="p-6 flex justify-center gap-2">
                                    <button onClick={() => { setEditingBooking(b); setEditData({passportNumber: b.passportNumber, paidAmount: b.paidAmount}) }} className="bg-blue-50 text-blue-600 p-3 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm">✏️</button>
                                    {b.status === 'Pending' && (
                                        <button onClick={() => handleConfirm(b._id)} className="bg-green-50 text-green-600 p-3 rounded-xl hover:bg-green-600 hover:text-white transition shadow-sm">✅</button>
                                    )}
                                    <button onClick={() => handleDelete(b._id)} className="bg-red-50 text-red-600 p-3 rounded-xl hover:bg-red-600 hover:text-white transition shadow-sm">🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* نافذة إضافة مسافر جديد (MODAL) */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[110] p-4">
                    <div className="bg-white p-8 rounded-[3rem] shadow-2xl w-full max-w-lg border-t-[12px] border-green-600 animate-in zoom-in duration-300">
                        <h2 className="text-3xl font-black mb-8 text-gray-800 text-center">👤 تسجيل مسافر جديد</h2>
                        <form onSubmit={handleAddTraveler} className="space-y-4">
                            <input 
                                type="text" placeholder="اسم المسافر الكامل" required
                                className="w-full p-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-green-500 font-bold"
                                value={newTraveler.name}
                                onChange={(e) => setNewTraveler({...newTraveler, name: e.target.value})}
                            />
                            <div className="flex gap-3">
                                <input 
                                    type="text" placeholder="رقم الهاتف" required
                                    className="flex-1 p-4 border-2 border-gray-100 rounded-2xl outline-none font-bold"
                                    value={newTraveler.phone}
                                    onChange={(e) => setNewTraveler({...newTraveler, phone: e.target.value})}
                                />
                                <input 
                                    type="text" placeholder="رقم الجواز"
                                    className="flex-1 p-4 border-2 border-gray-100 rounded-2xl outline-none font-bold"
                                    value={newTraveler.passportNumber}
                                    onChange={(e) => setNewTraveler({...newTraveler, passportNumber: e.target.value})}
                                />
                            </div>
                            <select 
                                className="w-full p-4 border-2 border-gray-100 rounded-2xl font-black bg-gray-50 text-blue-700 outline-none"
                                required
                                value={newTraveler.tripId}
                                onChange={(e) => setNewTraveler({...newTraveler, tripId: e.target.value})}
                            >
                                <option value="">-- اختر الرحلة المخصصة --</option>
                                {trips.map(trip => (
                                    <option key={trip._id} value={trip._id}>{trip.title} ({trip.price.toLocaleString()} د.ج)</option>
                                ))}
                            </select>

                            {/* خانة المبلغ المدفوع والحساب التلقائي */}
                            <div className="space-y-1">
                                <label className="text-xs font-black text-gray-400 pr-2">المبلغ المدفوع (د.ج):</label>
                                <input 
                                    type="number" placeholder="0"
                                    className="w-full p-4 border-2 border-gray-100 rounded-2xl outline-none font-black text-green-600 text-xl"
                                    value={newTraveler.paidAmount}
                                    onChange={(e) => setNewTraveler({...newTraveler, paidAmount: Number(e.target.value)})}
                                />
                            </div>

                            {newTraveler.tripId && (
                                <div className="bg-gray-50 p-5 rounded-[2rem] border-2 border-dashed border-gray-200 flex justify-between items-center">
                                    <span className="text-gray-500 font-bold">المبلغ المتبقي (الدين):</span>
                                    <span className={`font-black text-2xl ${remainingForNew > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {remainingForNew.toLocaleString()} د.ج
                                    </span>
                                </div>
                            )}

                            <div className="flex gap-4 mt-8">
                                <button type="submit" className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-green-700">حفظ البيانات</button>
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold">إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* نافذة التعديل */}
            {editingBooking && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md border-t-8 border-blue-600">
                        <h2 className="text-2xl font-black mb-8 text-gray-800 text-center">تحديث بيانات المسافر</h2>
                        <div className="space-y-4">
                            <input 
                                type="text" placeholder="رقم جواز السفر"
                                className="w-full p-4 border-2 border-gray-100 rounded-2xl font-bold text-center"
                                value={editData.passportNumber}
                                onChange={(e) => setEditData({...editData, passportNumber: e.target.value})}
                            />
                            <input 
                                type="number" placeholder="المبلغ المدفوع الكلي"
                                className="w-full p-4 border-2 border-blue-100 rounded-2xl font-black text-green-600 text-center text-2xl"
                                value={editData.paidAmount}
                                onChange={(e) => setEditData({...editData, paidAmount: e.target.value})}
                            />
                        </div>
                        <div className="flex gap-3 mt-10">
                            <button onClick={handleUpdate} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 shadow-lg">حفظ التغييرات</button>
                            <button onClick={() => setEditingBooking(null)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold">إلغاء</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManagement;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [trips, setTrips] = useState([]); // أضفنا حالة لتخزين الرحلات
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    
    // حالات نافذة التعديل
    const [editingBooking, setEditingBooking] = useState(null);
    const [editData, setEditData] = useState({ passportNumber: '', paidAmount: 0 });

    // حالات نافذة الإضافة الجديدة
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTraveler, setNewTraveler] = useState({
        name: '', phone: '', tripId: '', passportNumber: '', paidAmount: 0
    });

    const loadData = async () => {
        try {
            const [bookingRes, tripRes] = await Promise.all([
                axios.get('https://travel-agency-app-mawna-3.onrender.com/api/bookings'),
                axios.get('https://travel-agency-app-mawna-3.onrender.com/api/trips')
            ]);
            setBookings(bookingRes.data);
            setTrips(tripRes.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const filteredBookings = bookings.filter(b => {
        const matchesFilter = filter === 'all' || b.status === filter;
        const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             b.phone.includes(searchTerm) || 
                             b.trip_title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // دالة إضافة مسافر جديد
    const handleAddTraveler = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://travel-agency-app-mawna-3.onrender.com/api/bookings', newTraveler);
            alert("✅ تم تسجيل المسافر بنجاح");
            setShowAddModal(false);
            setNewTraveler({ name: '', phone: '', tripId: '', passportNumber: '', paidAmount: 0 });
            loadData();
        } catch (err) {
            alert("❌ فشل في إضافة المسافر، تأكد من ملء جميع الحقول");
        }
    };

    const handleConfirm = async (id) => {
        if(window.confirm("تأكيد الحجز سيقوم بخصم مقعد من الرحلة. هل أنت متأكد؟")) {
            await axios.patch(`https://travel-agency-app-mawna-3.onrender.com/api/bookings/${id}`, { status: 'Confirmed' });
            loadData();
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("حذف هذا السجل نهائياً؟")) {
            await axios.delete(`https://travel-agency-app-mawna-3.onrender.com/api/bookings/${id}`);
            loadData();
        }
    };

    const openEditModal = (booking) => {
        setEditingBooking(booking);
        setEditData({ passportNumber: booking.passportNumber || '', paidAmount: booking.paidAmount });
    };

    const handleUpdate = async () => {
        await axios.patch(`https://travel-agency-app-mawna-3.onrender.com/api/bookings/${editingBooking._id}`, editData);
        setEditingBooking(null);
        loadData();
    };

    if (loading) return <div className="text-center py-20 font-bold">جاري تحميل السجل...</div>;

    return (
        <div className="container mx-auto py-10 px-4 text-right font-arabic" dir="rtl">
            <div className="flex justify-between items-center mb-8 border-r-4 border-blue-600 pr-4">
                <h1 className="text-3xl font-black text-gray-800">سجل المسافرين والطلبات 📋</h1>
                {/* الزر الجديد للإضافة */}
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition transform hover:scale-105"
                >
                    + إضافة مسافر يدوياً
                </button>
            </div>

            {/* أدوات التحكم: بحث + فلتر */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border">
                <input 
                    type="text" 
                    placeholder="ابحث باسم المسافر، الهاتف، أو الرحلة..." 
                    className="flex-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                    className="p-3 border rounded-xl bg-gray-50 font-bold"
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">كل السجلات</option>
                    <option value="Pending">⌛ طلبات قيد الانتظار</option>
                    <option value="Confirmed">✅ مسافرون مؤكدون</option>
                </select>
            </div>

            {/* الجدول الشامل */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border">
                <table className="w-full text-right">
                    <thead className="bg-gray-800 text-white text-sm">
                        <tr>
                            <th className="p-4">المسافر / الهاتف</th>
                            <th className="p-4">الرحلة</th>
                            <th className="p-4">رقم الجواز</th>
                            <th className="p-4">المالية (د.ج)</th>
                            <th className="p-4">الحالة</th>
                            <th className="p-4">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.map(b => (
                            <tr key={b._id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-4">
                                    <div className="font-bold text-gray-800">{b.name}</div>
                                    <div className="text-xs text-gray-400 font-mono">{b.phone}</div>
                                </td>
                                <td className="p-4 text-sm font-medium text-blue-700">{b.trip_title}</td>
                                <td className="p-4 font-mono text-sm">{b.passportNumber || '---'}</td>
                                <td className="p-4">
                                    <div className="text-green-600 font-bold text-xs">مدفوع: {b.paidAmount?.toLocaleString()}</div>
                                    <div className="text-red-500 font-bold text-xs">متبقي: {b.remainingAmount?.toLocaleString()}</div>
                                </td>
                                <td className="p-4 text-xs">
                                    <span className={`px-3 py-1 rounded-full font-bold ${b.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {b.status === 'Confirmed' ? 'مؤكد' : 'انتظار'}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => openEditModal(b)} className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition" title="تعديل">✏️</button>
                                    {b.status === 'Pending' && (
                                        <button onClick={() => handleConfirm(b._id)} className="bg-green-50 text-green-600 p-2 rounded-lg hover:bg-green-600 hover:text-white transition" title="تأكيد وخصم مقعد">✅</button>
                                    )}
                                    <button onClick={() => handleDelete(b._id)} className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition" title="حذف">🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredBookings.length === 0 && <p className="text-center py-10 text-gray-400 font-bold">لا توجد نتائج مطابقة</p>}
            </div>

            {/* نافذة إضافة مسافر جديد (MODAL) */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg border-t-8 border-green-600 animate-in fade-in zoom-in duration-300">
                        <h2 className="text-2xl font-black mb-6 text-gray-800 text-center">👤 تسجيل مسافر جديد</h2>
                        <form onSubmit={handleAddTraveler} className="space-y-4">
                            <input 
                                type="text" placeholder="اسم المسافر الكامل" required
                                className="w-full p-3 border rounded-xl"
                                value={newTraveler.name}
                                onChange={(e) => setNewTraveler({...newTraveler, name: e.target.value})}
                            />
                            <div className="flex gap-2">
                                <input 
                                    type="text" placeholder="رقم الهاتف" required
                                    className="flex-1 p-3 border rounded-xl"
                                    value={newTraveler.phone}
                                    onChange={(e) => setNewTraveler({...newTraveler, phone: e.target.value})}
                                />
                                <input 
                                    type="text" placeholder="رقم الجواز"
                                    className="flex-1 p-3 border rounded-xl"
                                    value={newTraveler.passportNumber}
                                    onChange={(e) => setNewTraveler({...newTraveler, passportNumber: e.target.value})}
                                />
                            </div>
                            <select 
                                className="w-full p-3 border rounded-xl bg-gray-50 font-bold"
                                required
                                value={newTraveler.tripId}
                                onChange={(e) => setNewTraveler({...newTraveler, tripId: e.target.value})}
                            >
                                <option value="">-- اختر الرحلة --</option>
                                {trips.map(trip => (
                                    <option key={trip._id} value={trip._id}>{trip.title}</option>
                                ))}
                            </select>
                            <input 
                                type="number" placeholder="المبلغ المدفوع الأولي (د.ج)"
                                className="w-full p-3 border rounded-xl font-bold text-green-700"
                                value={newTraveler.paidAmount}
                                onChange={(e) => setNewTraveler({...newTraveler, paidAmount: e.target.value})}
                            />
                            <div className="flex gap-3 mt-8">
                                <button type="submit" className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700">حفظ المسافر</button>
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold">إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* نافذة التعديل (القديمة التي كانت لديك) */}
            {editingBooking && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
                        <h2 className="text-2xl font-black mb-6 border-b pb-4 text-gray-800 text-center">تحديث بيانات المسافر</h2>
                        <div className="space-y-4">
                            <input 
                                type="text" placeholder="رقم جواز السفر"
                                className="w-full p-3 border rounded-xl font-mono text-center"
                                value={editData.passportNumber}
                                onChange={(e) => setEditData({...editData, passportNumber: e.target.value})}
                            />
                            <input 
                                type="number" placeholder="المبلغ المدفوع الكلي"
                                className="w-full p-3 border-2 border-green-100 rounded-xl font-black text-green-700 text-center text-xl"
                                value={editData.paidAmount}
                                onChange={(e) => setEditData({...editData, paidAmount: e.target.value})}
                            />
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={handleUpdate} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">حفظ</button>
                            <button onClick={() => setEditingBooking(null)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold">إلغاء</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManagement;
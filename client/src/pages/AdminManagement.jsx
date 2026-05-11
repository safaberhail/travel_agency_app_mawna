import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, Pending, Confirmed
    const [searchTerm, setSearchTerm] = useState('');
    
    // حالات نافذة التعديل
    const [editingBooking, setEditingBooking] = useState(null);
    const [editData, setEditData] = useState({ passportNumber: '', paidAmount: 0 });

    const loadData = async () => {
        try {
            const res = await axios.get('https://travel-agency-app-mawna-3.onrender.com/api/bookings');
            setBookings(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    // تصفية البيانات بناءً على البحث والفلتر
    const filteredBookings = bookings.filter(b => {
        const matchesFilter = filter === 'all' || b.status === filter;
        const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             b.phone.includes(searchTerm) || 
                             b.trip_title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

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
        <div className="container mx-auto py-10 px-4 text-right" dir="rtl">
            <h1 className="text-3xl font-black mb-8 text-gray-800 border-r-4 border-blue-600 pr-4">سجل المسافرين والطلبات 📋</h1>

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
                                    <div className="text-green-600 font-bold text-xs">مدفوع: {b.paidAmount.toLocaleString()}</div>
                                    <div className="text-red-500 font-bold text-xs">متبقي: {b.remainingAmount.toLocaleString()}</div>
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

            {/* نافذة التعديل المنبثقة */}
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
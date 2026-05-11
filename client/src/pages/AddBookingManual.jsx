import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddBookingManual = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '', 
        phone: '', 
        passportNumber: '', 
        persons: 1, 
        paidAmount: 0, 
        trip_id: '',
        status: 'Confirmed' // الحجز اليدوي يكون مؤكداً تلقائياً
    });

    useEffect(() => {
        // جلب الرحلات المتوفرة ليختار المدير منها
        axios.get('http://localhost:5001/api/trips')
            .then(res => {
                setTrips(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // العثور على بيانات الرحلة المختارة لحساب السعر الإجمالي
        const selectedTrip = trips.find(t => t._id === formData.trip_id);
        
        if (!selectedTrip) return alert("❌ يرجى اختيار رحلة من القائمة");
        if (selectedTrip.availableSeats < formData.persons) return alert("❌ عذراً، لا توجد مقاعد كافية في هذه الرحلة");

        try {
            const finalData = {
                ...formData,
                trip_title: selectedTrip.title,
                totalPrice: selectedTrip.price * formData.persons
            };

            await axios.post('http://localhost:5001/api/bookings', finalData);
            alert("✅ تم تسجيل المسافر بنجاح وتحديث المقاعد المالية.");
            navigate('/admin/dashboard'); // الانتقال للداشبورد لرؤية الحجز
        } catch (err) {
            alert("❌ فشل التسجيل، تأكد من ملء البيانات بشكل صحيح");
        }
    };

    if (loading) return <div className="text-center py-20 font-bold">جاري تحميل قائمة الرحلات...</div>;

    return (
        <div className="max-w-3xl mx-auto my-10 p-8 bg-white shadow-2xl rounded-3xl text-right" dir="rtl">
            <div className="flex items-center justify-between mb-8 border-b pb-4">
                <h2 className="text-3xl font-black text-blue-900">تسجيل مسافر جديد 📝</h2>
                <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-lg text-sm font-bold">إضافة مكتبية</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. اختيار الرحلة */}
                <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200">
                    <label className="block mb-2 font-black text-gray-700">اختر الرحلة المطلوبة:</label>
                    <select 
                        className="w-full p-4 border rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500 font-bold" 
                        required
                        onChange={(e) => setFormData({...formData, trip_id: e.target.value})}
                    >
                        <option value="">-- اضغط للاختيار من الرحلات المتاحة --</option>
                        {trips.map(trip => (
                            <option key={trip._id} value={trip._id}>
                                {trip.title} | {trip.price.toLocaleString()} د.ج | ({trip.availableSeats} مقعد متبقي)
                            </option>
                        ))}
                    </select>
                </div>

                {/* 2. بيانات المسافر الشخصية */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-bold text-gray-600">الاسم واللقب</label>
                        <input type="text" placeholder="اسم المسافر الكامل" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-bold text-gray-600">رقم الهاتف</label>
                        <input type="text" placeholder="05 / 06 / 07 ..." className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>
                </div>

                {/* 3. بيانات الجواز والعدد والمالية */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-bold text-gray-600">رقم جواز السفر</label>
                        <input type="text" className="w-full p-3 border rounded-xl font-mono" required 
                        onChange={(e) => setFormData({...formData, passportNumber: e.target.value})} />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-bold text-gray-600">عدد الأشخاص</label>
                        <input type="number" min="1" className="w-full p-3 border rounded-xl" required 
                        onChange={(e) => setFormData({...formData, persons: e.target.value})} value={formData.persons} />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-bold text-green-600">المبلغ المدفوع (د.ج)</label>
                        <input type="number" placeholder="0" className="w-full p-3 border-2 border-green-200 rounded-xl font-bold text-green-700 outline-none" required
                        onChange={(e) => setFormData({...formData, paidAmount: e.target.value})} />
                    </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex justify-between items-center">
                    <span className="font-bold text-gray-600">الحالة التلقائية:</span>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-md text-xs font-bold font-arabic">حجز مؤكد فوري</span>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-xl shadow-lg transition-transform transform hover:scale-[1.01]">
                    💾 حفظ المسافر وتأكيد الحجز
                </button>
            </form>
        </div>
    );
};

export default AddBookingManual;
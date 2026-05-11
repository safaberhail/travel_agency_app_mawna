import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AGENCY_SETTINGS } from '../agencyConfig';

const TripDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const isAdmin = localStorage.getItem('adminToken') !== null;

    const [bookingData, setBookingData] = useState({ 
        name: '', phone: '', passportNumber: '', paidAmount: 0, persons: 1 
    });

    useEffect(() => {
        axios.get(`https://travel-agency-app-mawna-3.onrender.com/api/trips/${id}`).then(res => {
            setTrip(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [id]);

    const handleAdminBooking = async (e) => {
        e.preventDefault();
        try {
            const finalData = { ...bookingData, trip_id: id, trip_title: trip.title, totalPrice: trip.price * bookingData.persons, status: 'Confirmed', paidAmount: Number(bookingData.paidAmount) };
            await axios.post('https://travel-agency-app-mawna-3.onrender.com/api/bookings', finalData);
            alert("✅ تم الحجز في سجلات الوكالة");
            navigate('/admin/management');
        } catch (err) { alert("❌ فشل الحجز"); }
    };

    if (loading) return <div className="text-center py-20 font-bold animate-pulse">جاري تحميل التفاصيل...</div>;
    if (!trip) return <div className="text-center py-20 font-bold text-red-500">الرحلة غير موجودة!</div>;

    return (
        <div className="container mx-auto py-10 px-4 text-right" dir="rtl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                    <div className="flex justify-center mb-6">
                        <img src={`https://travel-agency-app-mawna-3.onrender.com${trip.image}`} className="w-full max-w-2xl h-[300px] object-cover rounded-3xl shadow-xl border border-gray-100" alt={trip.title} />
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-4xl font-black text-gray-900">{trip.title}</h1>
                        {isAdmin && (
                            <button onClick={() => {
                                if(window.confirm("حذف الرحلة نهائياً؟")) {
                                    axios.delete(`https://travel-agency-app-mawna-3.onrender.com/api/trips/${id}`).then(() => navigate('/'));
                                }
                            }} className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold">حذف الرحلة 🗑️</button>
                        )}
                    </div>
                    <p className="text-2xl font-bold text-blue-600 mb-6">{trip.price.toLocaleString()} د.ج / شخص</p>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border text-lg leading-loose whitespace-pre-line">
                        <h3 className="text-xl font-bold mb-4 border-b pb-2 text-blue-800">برنامج الرحلة</h3>
                        {trip.description}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    {isAdmin ? (
                        <div className="bg-white p-8 rounded-3xl shadow-2xl border-t-8 border-blue-600 sticky top-24">
                            <h2 className="text-2xl font-black mb-6 text-center">تسجيل مسافر يدوي</h2>
                            <form onSubmit={handleAdminBooking} className="space-y-4">
                                <input type="text" placeholder="الاسم واللقب" className="w-full p-3 border rounded-xl" required onChange={e => setBookingData({...bookingData, name: e.target.value})} />
                                <input type="text" placeholder="رقم الهاتف" className="w-full p-3 border rounded-xl" required onChange={e => setBookingData({...bookingData, phone: e.target.value})} />
                                <input type="text" placeholder="رقم الجواز" className="w-full p-3 border rounded-xl" onChange={e => setBookingData({...bookingData, passportNumber: e.target.value})} />
                                <input type="number" placeholder="المبلغ المدفوع" className="w-full p-3 border rounded-xl font-bold text-green-600" required onChange={e => setBookingData({...bookingData, paidAmount: e.target.value})} />
                                <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg">تأكيد وتسجيل</button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-3xl shadow-2xl border-t-8 border-orange-500 sticky top-24 text-center">
                            <h2 className="text-2xl font-black mb-4 text-gray-800 tracking-tight">للحجز والاستفسار 📞</h2>
                            <div className="space-y-3">
                                <a href={`tel:${AGENCY_SETTINGS.phone1}`} className="flex items-center justify-center gap-3 w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition">
                                    <span>📞 {AGENCY_SETTINGS.phone1}</span>
                                </a>
                                <a href={`tel:${AGENCY_SETTINGS.phone2}`} className="flex items-center justify-center gap-3 w-full bg-blue-500 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition">
                                    <span>📞 {AGENCY_SETTINGS.phone2}</span>
                                </a>
                                <a href={`https://wa.me/${AGENCY_SETTINGS.whatsapp}`} target="_blank" className="flex items-center justify-center gap-3 w-full bg-green-500 text-white py-4 rounded-2xl font-bold hover:bg-green-600 transition">
                                    <span>💬 واتساب: {AGENCY_SETTINGS.whatsapp}</span>
                                </a>
                                <a href={AGENCY_SETTINGS.facebook} target="_blank" className="flex items-center justify-center gap-3 w-full bg-blue-800 text-white py-4 rounded-2xl font-bold hover:bg-blue-900 transition">
                                    <span>🔵 تابعنا على فيسبوك</span>
                                </a>
                                <div className="mt-8 pt-6 border-t text-right">
                                    <p className="font-bold text-gray-700">📍 المقر:</p>
                                    <p className="text-gray-500 text-sm">{AGENCY_SETTINGS.address}</p>
                                    <p className="font-bold mt-4">🕒 أوقات العمل:</p>
                                    <p className="text-gray-500 text-sm">{AGENCY_SETTINGS.workingHours}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default TripDetails;
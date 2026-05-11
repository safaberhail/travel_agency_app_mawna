import React, { useState } from 'react';
import axios from 'axios';

const AddTrip = () => {
    const [formData, setFormData] = useState({
        title: '', 
        country: '', 
        category: 'سياحة خارجية', // القيمة الافتراضية
        duration: '', 
        price: '', 
        maxSeats: 30, 
        date: '', 
        description: ''
    });
    const [imageFile, setImageFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(!imageFile) return alert("يرجى اختيار صورة");

        const data = new FormData();
        data.append('title', formData.title);
        data.append('country', formData.country);
        data.append('category', formData.category);
        data.append('duration', formData.duration);
        data.append('price', formData.price);
        data.append('maxSeats', formData.maxSeats);
        data.append('date', formData.date);
        data.append('description', formData.description);
        data.append('image', imageFile);

        try {
            // الإرسال للمنفذ 5001
            await axios.post('https://travel-agency-app-mawna-3.onrender.com/api/trips', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("✅ تم إضافة الرحلة بنجاح!");
            window.location.href = "/"; // العودة للرئيسية
        } catch (err) {
            console.error(err.response?.data);
            alert("❌ فشل الإضافة: تأكد من ملء جميع الحقول");
        }
    };

    return (
        <div className="max-w-2xl mx-auto my-10 p-8 bg-white shadow-2xl rounded-3xl text-right" dir="rtl">
            <h2 className="text-3xl font-black mb-8 text-blue-900 border-b pb-4 text-center">إضافة رحلة جديدة ✈️</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">اسم الرحلة</label>
                        <input type="text" placeholder="مثلاً: رحلة تيميمون" className="w-full p-3 border rounded-xl" required 
                        onChange={(e) => setFormData({...formData, title: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">صنف الرحلة</label>
                        <select className="w-full p-3 border rounded-xl bg-gray-50" 
                        onChange={(e) => setFormData({...formData, category: e.target.value})}>
                            <option value="سياحة خارجية">سياحة خارجية 🌍</option>
                            <option value="سياحة داخلية">سياحة داخلية 🇩🇿</option>
                            <option value="عمرة">عمرة 🕋</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="الدولة" className="w-full p-3 border rounded-xl" required 
                    onChange={(e) => setFormData({...formData, country: e.target.value})} />
                    <input type="number" placeholder="السعر (د.ج)" className="w-full p-3 border rounded-xl" required 
                    onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="إجمالي المقاعد" className="w-full p-3 border rounded-xl" required 
                    onChange={(e) => setFormData({...formData, maxSeats: e.target.value})} value={formData.maxSeats} />
                    <input type="date" className="w-full p-3 border rounded-xl" required 
                    onChange={(e) => setFormData({...formData, date: e.target.value})} />
                </div>

                <input type="text" placeholder="المدة (مثلاً: 7 أيام)" className="w-full p-3 border rounded-xl" required 
                onChange={(e) => setFormData({...formData, duration: e.target.value})} />

                <div className="p-4 border-2 border-dashed border-blue-100 rounded-2xl bg-blue-50 text-center">
                    <label className="block mb-2 font-bold text-blue-600">تحميل صورة من الحاسوب</label>
                    <input type="file" accept="image/*" className="w-full text-sm" required 
                    onChange={(e) => setImageFile(e.target.files[0])} />
                </div>

                <textarea placeholder="وصف وتفاصيل الرحلة..." className="w-full p-3 border rounded-xl h-32" required 
                onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-xl shadow-lg transition">
                    نشر الرحلة الآن
                </button>
            </form>
        </div>
    );
};

export default AddTrip;
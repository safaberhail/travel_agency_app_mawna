import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5001/api/auth/login', form);
            localStorage.setItem('adminToken', res.data.token);
            alert("✅ تم الدخول بنجاح!");
            navigate('/admin/management');
            window.location.reload();
        } catch (err) {
            alert("❌ خطأ: اسم المستخدم أو كلمة المرور غير صحيحة");
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center font-arabic">
            <form onSubmit={handleLogin} className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border-t-8 border-blue-600">
                <h2 className="text-3xl font-black mb-8 text-center text-gray-800">دخول المدير 🔐</h2>
                <div className="space-y-4">
                    <input type="text" placeholder="اسم المستخدم" className="w-full p-4 border rounded-xl text-center font-bold" 
                    onChange={e => setForm({...form, username: e.target.value})} required />
                    
                    <input type="password" placeholder="كلمة المرور" className="w-full p-4 border rounded-xl text-center" 
                    onChange={e => setForm({...form, password: e.target.value})} required />
                    
                    <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-blue-700 transition shadow-lg">
                        دخول
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
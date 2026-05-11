{/* نافذة إضافة مسافر جديد المطورة ذكياً */}
{showAddModal && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-lg border-t-[10px] border-green-600 animate-in fade-in zoom-in duration-300">
            <h2 className="text-3xl font-black mb-8 text-gray-800 text-center">👤 تسجيل مسافر جديد</h2>
            
            <form onSubmit={handleAddTraveler} className="space-y-5">
                {/* اسم المسافر */}
                <input 
                    type="text" placeholder="اسم المسافر الكامل" required
                    className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-green-500 outline-none transition-all font-bold"
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

                {/* اختيار الرحلة */}
                <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 mr-2">اختر الرحلة المتاحة</label>
                    <select 
                        className="w-full p-4 border-2 border-gray-50 bg-gray-50 rounded-2xl font-black text-blue-700 outline-none"
                        required
                        value={newTraveler.tripId}
                        onChange={(e) => setNewTraveler({...newTraveler, tripId: e.target.value})}
                    >
                        <option value="">-- اختر الرحلة --</option>
                        {trips.map(trip => (
                            <option key={trip._id} value={trip._id}>{trip.title} ({trip.price.toLocaleString()} د.ج)</option>
                        ))}
                    </select>
                </div>

                {/* قسم الحسابات التلقائية */}
                {newTraveler.tripId && (
                    <div className="bg-green-50 p-5 rounded-3xl border border-green-100 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-bold">سعر الرحلة الإجمالي:</span>
                            <span className="font-black text-blue-700">
                                {trips.find(t => t._id === newTraveler.tripId)?.price.toLocaleString()} د.ج
                            </span>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-black text-green-700">المبلغ المدفوع حالياً:</label>
                            <input 
                                type="number" 
                                className="w-full p-3 bg-white border-2 border-green-200 rounded-xl font-black text-green-700 text-xl"
                                value={newTraveler.paidAmount}
                                onChange={(e) => setNewTraveler({...newTraveler, paidAmount: Number(e.target.value)})}
                            />
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-green-200">
                            <span className="text-red-500 font-bold">المبلغ المتبقي (الدين):</span>
                            <span className="font-black text-red-600 text-xl">
                                {( (trips.find(t => t._id === newTraveler.tripId)?.price || 0) - newTraveler.paidAmount ).toLocaleString()} د.ج
                            </span>
                        </div>
                    </div>
                )}

                <div className="flex gap-4 mt-6">
                    <button type="submit" className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-green-700 transition-all transform hover:scale-105">
                        حفظ المسافر
                    </button>
                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold hover:bg-gray-200 transition">
                        إلغاء
                    </button>
                </div>
            </form>
        </div>
    </div>
)}
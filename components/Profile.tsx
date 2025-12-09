import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { User, Mail, Phone, LogOut, Ticket, Clock, Calendar } from 'lucide-react';
import QRCode from 'react-qr-code';
import { format } from 'date-fns';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Info Column */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <User size={32} />
                        </div>
                        <div>
                            <h2 className="font-bold text-xl text-gray-900">{user.name}</h2>
                            <p className="text-gray-500 text-sm capitalize">{user.gender || 'User'}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold">Full Name</label>
                            {isEditing ? (
                                <input 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full mt-1 p-2 border rounded-lg"
                                />
                            ) : (
                                <p className="text-gray-900">{user.name}</p>
                            )}
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold">Email</label>
                            <p className="text-gray-900 flex items-center gap-2 mt-1">
                                <Mail size={14} className="text-gray-400" /> {user.email}
                            </p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold">Phone</label>
                            {isEditing ? (
                                <input 
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                    className="w-full mt-1 p-2 border rounded-lg"
                                />
                            ) : (
                                <p className="text-gray-900 flex items-center gap-2 mt-1">
                                    <Phone size={14} className="text-gray-400" /> {user.phone || 'Not set'}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3">
                        {isEditing ? (
                            <button onClick={handleSave} className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-semibold">Save Changes</button>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="flex-1 bg-gray-100 text-gray-900 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200">Edit Profile</button>
                        )}
                    </div>
                </div>

                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl font-medium hover:bg-red-100 transition-colors">
                    <LogOut size={18} /> Logout
                </button>
            </div>

            {/* Bookings Column */}
            <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Ticket size={24} className="text-primary" /> Recent Bookings
                </h2>

                {(!user.recentBookings || user.recentBookings.length === 0) ? (
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
                        <p className="text-gray-500">No bookings yet.</p>
                        <button onClick={() => navigate('/salons')} className="mt-4 text-primary font-semibold hover:underline">Find a salon</button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {user.recentBookings.map((booking) => (
                            <div key={booking.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-primary/30 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{booking.salonName}</h3>
                                        <p className="text-gray-600">{booking.serviceName}</p>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><Calendar size={14}/> {format(new Date(booking.date), 'MMM d, yyyy')}</span>
                                            <span className="flex items-center gap-1"><Clock size={14}/> {booking.time}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedTicket(selectedTicket === booking.id ? null : booking.id)}
                                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        {selectedTicket === booking.id ? 'Hide Ticket' : 'View Ticket'}
                                    </button>
                                </div>

                                {selectedTicket === booking.id && (
                                    <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col items-center animate-fade-in">
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                            <QRCode value={booking.qrValue} size={150} />
                                        </div>
                                        <p className="text-xs font-mono text-gray-400 mt-2">Ref: {booking.id}</p>
                                        <p className="text-sm text-center text-gray-600 mt-4 max-w-xs">
                                            Show this QR code at the reception of <strong>{booking.salonName}</strong>
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default Profile;

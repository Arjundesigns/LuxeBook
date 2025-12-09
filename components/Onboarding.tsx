
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Check } from 'lucide-react';

const SERVICES = ['Haircut', 'Facial', 'Grooming', 'Spa', 'Beard Trim', 'Massage', 'Manicure', 'Pedicure'];
const GENDERS = ['Male', 'Female', 'Other'];

const Onboarding = () => {
  const { updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [gender, setGender] = useState('');
  const [preferences, setPreferences] = useState<string[]>([]);

  const togglePreference = (service: string) => {
    if (preferences.includes(service)) {
      setPreferences(preferences.filter(p => p !== service));
    } else {
      setPreferences([...preferences, service]);
    }
  };

  const handleComplete = () => {
    updateProfile({ gender, preferences });
    const from = location.state?.from || '/';
    navigate(from);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Help us customize your experience</h1>
        <p className="text-gray-500 mb-8">Tell us a bit about yourself to get personalized salon recommendations.</p>

        <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">Gender</h3>
            <div className="flex gap-3">
                {GENDERS.map(g => (
                    <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={`px-6 py-2 rounded-full border transition-all ${
                            gender === g 
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                        }`}
                    >
                        {g}
                    </button>
                ))}
            </div>
        </div>

        <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">What services are you interested in?</h3>
            <div className="flex flex-wrap gap-2">
                {SERVICES.map(s => {
                    const isSelected = preferences.includes(s);
                    return (
                        <button
                            key={s}
                            onClick={() => togglePreference(s)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all flex items-center gap-2 ${
                                isSelected 
                                ? 'bg-primary/10 text-primary border-primary' 
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {isSelected && <Check size={14} />}
                            {s}
                        </button>
                    );
                })}
            </div>
        </div>

        <button 
            onClick={handleComplete}
            disabled={!gender}
            className={`w-full py-3 rounded-xl font-bold transition-all ${
                gender ? 'bg-primary text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
            Start Booking
        </button>
      </div>
    </div>
  );
};

export default Onboarding;

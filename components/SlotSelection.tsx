import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, Sun, Moon, Sunrise } from 'lucide-react';
import { useBooking } from '../BookingContext';
import { TIME_SLOTS } from '../constants';
import { format, addDays, startOfToday } from 'date-fns';

const SlotSelection = () => {
  const navigate = useNavigate();
  const { selectedSalon, selectedService, setSelectedDate, setSelectedSlot } = useBooking();
  
  const today = startOfToday();
  const [activeDateIndex, setActiveDateIndex] = useState(0);
  const [localSelectedSlot, setLocalSelectedSlot] = useState<string | null>(null);

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => addDays(today, i));

  if (!selectedSalon || !selectedService) {
    return (
        <div className="p-10 text-center">
            <p>Session expired. Please restart your booking.</p>
            <button onClick={() => navigate('/salons')} className="text-primary underline mt-2">Go to Salons</button>
        </div>
    );
  }

  const handleConfirm = () => {
    if (localSelectedSlot) {
        setSelectedDate(dates[activeDateIndex]);
        setSelectedSlot(localSelectedSlot);
        navigate('/confirm');
    }
  };

  const getSlotIcon = (period: string) => {
    if (period === 'Morning') return <Sunrise size={18} />;
    if (period === 'Afternoon') return <Sun size={18} />;
    return <Moon size={18} />;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft size={20} /> Back to Services
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Select Date & Time</h1>
        <p className="text-gray-500">
            For <span className="font-semibold text-gray-900">{selectedService.name}</span> at {selectedSalon.name}
        </p>
      </div>

      {/* Date Scroller */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {dates.map((date, index) => {
                const isActive = index === activeDateIndex;
                return (
                    <button
                        key={index}
                        onClick={() => {
                            setActiveDateIndex(index);
                            setLocalSelectedSlot(null);
                        }}
                        className={`flex-shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center transition-all ${
                            isActive 
                            ? 'bg-primary text-white shadow-md scale-105' 
                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        <span className="text-xs font-medium uppercase">{format(date, 'EEE')}</span>
                        <span className="text-xl font-bold">{format(date, 'd')}</span>
                    </button>
                );
            })}
        </div>
      </div>

      {/* Time Slots */}
      <div className="space-y-8">
        {Object.entries(TIME_SLOTS).map(([period, slots]) => (
            <div key={period} className="animate-fade-in">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                    {getSlotIcon(period)} {period}
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {slots.map(slot => (
                        <button
                            key={slot}
                            onClick={() => setLocalSelectedSlot(slot)}
                            className={`py-2 px-1 text-sm rounded-lg border transition-all duration-200 ${
                                localSelectedSlot === slot
                                ? 'bg-primary text-white border-primary shadow-sm'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary'
                            }`}
                        >
                            {slot}
                        </button>
                    ))}
                </div>
            </div>
        ))}
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
            <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Selected Slot</p>
                <p className="font-bold text-gray-900">
                    {localSelectedSlot 
                        ? `${format(dates[activeDateIndex], 'MMM d')} • ${localSelectedSlot}` 
                        : 'Please select a time'}
                </p>
            </div>
            <button
                onClick={handleConfirm}
                disabled={!localSelectedSlot}
                className={`px-8 py-3 rounded-full font-semibold shadow-lg transition-all ${
                    localSelectedSlot
                    ? 'bg-primary text-white hover:bg-indigo-700 hover:-translate-y-1'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
                Continue
            </button>
        </div>
      </div>
      <div className="h-24"></div> {/* Spacer for fixed bottom bar */}
    </div>
  );
};

export default SlotSelection;

import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { CheckCircle, Download, Home, Calendar } from 'lucide-react';
import { useBooking } from '../BookingContext';
import { useAuth } from '../AuthContext';
import { format } from 'date-fns';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const { selectedSalon, selectedService, selectedDate, selectedSlot, resetBooking } = useBooking();
  const { addBooking, user } = useAuth();
  const qrRef = useRef<HTMLDivElement>(null);

  // If page is refreshed and state is lost, redirect home
  if (!selectedSalon || !selectedService || !selectedDate || !selectedSlot) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <button onClick={() => navigate('/')} className="text-primary font-bold">Return Home</button>
        </div>
    );
  }

  // Generate Booking Reference
  const bookingRef = `BK-${Math.floor(Math.random() * 100000)}`;
  
  const qrValue = JSON.stringify({
    ref: bookingRef,
    salon: selectedSalon.name,
    service: selectedService?.name,
    date: selectedDate,
    time: selectedSlot
  });

  // Save booking only once on mount
  useEffect(() => {
    if (user && selectedSalon && selectedService && selectedDate && selectedSlot) {
        addBooking({
            id: bookingRef,
            salonName: selectedSalon.name,
            salonAddress: selectedSalon.address,
            serviceName: selectedService.name,
            date: selectedDate.toISOString(),
            time: selectedSlot,
            qrValue: qrValue,
            timestamp: Date.now()
        });
    }
  }, []); // Empty dependency array to run once

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width + 40; // Add padding
            canvas.height = img.height + 40;
            if(ctx) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 20, 20);
                const pngFile = canvas.toDataURL("image/png");
                const downloadLink = document.createElement("a");
                downloadLink.download = `Booking-${bookingRef}.png`;
                downloadLink.href = pngFile;
                downloadLink.click();
            }
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  const handleDone = () => {
      resetBooking();
      navigate('/profile'); // Go to profile to see the ticket
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative z-10 animate-scale-up">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-500 rounded-full p-4 shadow-lg border-4 border-primary">
                <CheckCircle size={48} className="text-white" />
            </div>

            <div className="mt-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h1>
                <p className="text-gray-500 mt-1">Your appointment is set.</p>
                <div className="mt-2 inline-block bg-gray-100 px-3 py-1 rounded text-xs font-mono text-gray-600">
                    Ref: {bookingRef}
                </div>
            </div>

            <div className="my-8 flex justify-center">
                <div className="bg-white p-4 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.05)] border border-gray-100" ref={qrRef}>
                    <QRCode 
                        value={qrValue} 
                        size={180} 
                        level="H" 
                        fgColor="#1f2937"
                    />
                </div>
            </div>

            <div className="space-y-4 mb-8">
                 <div className="flex items-center gap-3 text-left bg-gray-50 p-3 rounded-lg">
                    <div className="bg-white p-2 rounded shadow-sm text-primary"><Calendar size={20}/></div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">When</p>
                        <p className="text-sm font-semibold text-gray-900">{selectedDate && format(selectedDate, 'MMM d')} at {selectedSlot}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 text-left bg-gray-50 p-3 rounded-lg">
                    <div className="bg-white p-2 rounded shadow-sm text-secondary"><Home size={20}/></div>
                    <div>
                         <p className="text-xs text-gray-500 uppercase font-bold">Where</p>
                        <p className="text-sm font-semibold text-gray-900">{selectedSalon.name}</p>
                    </div>
                 </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={downloadQR}
                    className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-xl font-semibold transition-colors"
                >
                    <Download size={18} /> Save Ticket
                </button>
                <button 
                    onClick={handleDone}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-colors"
                >
                    <Home size={18} /> View Profile
                </button>
            </div>
        </div>
    </div>
  );
};

export default BookingSuccess;

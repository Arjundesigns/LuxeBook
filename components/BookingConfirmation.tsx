
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, MapPin, Scissors, CreditCard, X, ShieldCheck, Loader2 } from 'lucide-react';
import { useBooking } from '../BookingContext';
import { format } from 'date-fns';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const { selectedSalon, selectedService, selectedDate, selectedSlot } = useBooking();
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form states
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  if (!selectedSalon || !selectedService || !selectedDate || !selectedSlot) {
    navigate('/salons');
    return null;
  }

  const tax = selectedService.price * 0.18; // 18% GST
  const total = selectedService.price + tax;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API call delay for payment processing
    setTimeout(() => {
        setIsProcessing(false);
        navigate('/success');
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substr(i, 4));
    }
    return parts.length > 1 ? parts.join(' ') : value;
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 relative">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft size={20} /> Change Time
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Review & Confirm</h1>

      {/* Booking Summary Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        
        {/* Salon Header */}
        <div className="bg-gray-50 p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedSalon.name}</h2>
            <div className="flex items-center text-gray-500 text-sm gap-2">
                <MapPin size={16} />
                {selectedSalon.address}
            </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
            <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                    <Calendar size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium uppercase">Date & Time</p>
                    <p className="font-semibold text-gray-900">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                    <p className="text-gray-600">{selectedSlot}</p>
                </div>
            </div>

            <div className="flex gap-4 items-start">
                <div className="bg-secondary/10 p-3 rounded-xl text-secondary">
                    <Scissors size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium uppercase">Service</p>
                    <p className="font-semibold text-gray-900">{selectedService.name}</p>
                    <p className="text-gray-600">{selectedService.duration}</p>
                </div>
            </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-gray-50 p-6 border-t border-gray-100 space-y-2">
            <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span>₹{selectedService.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-sm">
                <span>Tax (18% GST)</span>
                <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total to Pay</span>
                <span className="font-bold text-xl text-primary">₹{total.toFixed(2)}</span>
            </div>
        </div>
      </div>

      <button
        onClick={() => setShowPayment(true)}
        className="w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all text-lg flex justify-center items-center gap-2 bg-gray-900 hover:bg-black hover:-translate-y-1"
      >
        Proceed to Payment
      </button>

      {/* Payment Modal Overlay */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowPayment(false)} />
          
          <div className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl animate-fade-in-up overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="text-green-600" size={20} />
                    <h3 className="font-bold text-gray-900">Secure Payment</h3>
                </div>
                <button onClick={() => setShowPayment(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handlePayment} className="p-6 space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl mb-4 border border-blue-100">
                    <p className="text-sm text-blue-800 flex justify-between font-bold items-center">
                        <span>Total Amount Payable</span>
                        <span className="text-lg">₹{total.toFixed(2)}</span>
                    </p>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number</label>
                    <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            required
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry Date</label>
                        <input 
                            type="text" 
                            required
                            placeholder="MM/YY"
                            maxLength={5}
                            value={expiry}
                            onChange={(e) => {
                                let v = e.target.value.replace(/[^0-9]/g, '');
                                if (v.length >= 2) v = v.substring(0,2) + '/' + v.substring(2,4);
                                setExpiry(v);
                            }}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVV</label>
                        <input 
                            type="password" 
                            required
                            placeholder="123"
                            maxLength={3}
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name on Card</label>
                    <input 
                        type="text" 
                        required
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="animate-spin" size={20} /> Processing...
                            </>
                        ) : (
                            <>Pay ₹{total.toFixed(2)}</>
                        )}
                    </button>
                    
                    <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                        <ShieldCheck size={12} /> SSL Encrypted & Secure Connection
                    </p>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingConfirmation;

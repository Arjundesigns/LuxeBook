
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, ChevronLeft, CheckCircle } from 'lucide-react';
import { MOCK_SALONS } from '../constants';
import { useBooking } from '../BookingContext';
import { useAuth } from '../AuthContext';
import { Salon, Service } from '../types';

const SalonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedSalon, setSelectedSalon, setSelectedService } = useBooking();
  const { user } = useAuth();

  // Load salon data if accessed directly via URL
  useEffect(() => {
    if (!selectedSalon && id) {
      const salon = MOCK_SALONS.find(s => s.id === id);
      if (salon) setSelectedSalon(salon);
    }
  }, [id, selectedSalon, setSelectedSalon]);

  if (!selectedSalon) {
    return <div className="p-10 text-center">Loading salon...</div>;
  }

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    
    if (!user) {
        // Redirect to login but save the intended destination
        navigate('/login', { state: { from: '/slots' } });
        return;
    }

    navigate('/slots');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft size={20} /> Back to Results
      </button>

      {/* Header Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="relative h-64 md:h-80">
          <img 
            src={selectedSalon.image} 
            alt={selectedSalon.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 md:p-8 text-white">
             <h1 className="text-3xl md:text-4xl font-bold mb-2">{selectedSalon.name}</h1>
             <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm md:text-base">
                <span className="flex items-center gap-1"><MapPin size={18} /> {selectedSalon.address}</span>
                <span className="flex items-center gap-1"><Star size={18} className="text-yellow-400 fill-yellow-400"/> {selectedSalon.rating} ({selectedSalon.reviewCount} reviews)</span>
                <span className="flex items-center gap-1"><Clock size={18} /> {selectedSalon.hours}</span>
             </div>
          </div>
        </div>
        
        <div className="p-6 md:p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-gray-600 leading-relaxed">{selectedSalon.description}</p>
        </div>
      </div>

      {/* Services Section */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Service</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedSalon.services.map((service) => (
          <div 
            key={service.id}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:border-primary/50 transition-colors"
          >
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{service.name}</h3>
              <p className="text-gray-500 text-sm">{service.duration} • Professional Staff</p>
            </div>
            <div className="flex flex-col items-end gap-2">
                <span className="font-bold text-lg text-primary">₹{service.price}</span>
                <button 
                  onClick={() => handleBookService(service)}
                  className="bg-gray-900 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-primary transition-colors flex items-center gap-2"
                >
                  Book
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalonDetails;

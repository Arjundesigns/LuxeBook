
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Loader2 } from 'lucide-react';
import { MOCK_SALONS } from '../constants';
import { useBooking } from '../BookingContext';
import { Salon } from '../types';
import { calculateDistance } from '../utils';
import { getNearbySalons } from '../services/gemini';

// Curated list of high-quality salon images for fallbacks
const SALON_FALLBACKS = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1521590832169-7dad1a175f6c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80"
];

// Helper to assign mock services and images to real data for the demo
const enhanceSalons = (apiSalons: any[], userLat: number, userLng: number): Salon[] => {
    return apiSalons.map((s, index) => ({
        ...s,
        // Use image from API if available, otherwise use a high-quality fallback from our curated list
        image: s.imageUrl || SALON_FALLBACKS[index % SALON_FALLBACKS.length],
        hours: 'Mon-Sat: 9:00 AM - 8:00 PM', // Default hours
        // Assign mock services so booking works
        services: [
             // Haircut price randomized between 200 and 350
             { id: `s${index}_1`, name: 'Haircut & Style', price: 200 + Math.floor(Math.random() * 151), duration: '45m' },
             { id: `s${index}_2`, name: 'Color Treatment', price: 2500 + Math.floor(Math.random() * 3000), duration: '2h' },
             { id: `s${index}_3`, name: 'Manicure', price: 600, duration: '30m' }
        ],
        latitude: userLat + (Math.random() * 0.01 - 0.005), // Approximate if not provided
        longitude: userLng + (Math.random() * 0.01 - 0.005),
        isOpen: true,
        distance: 'Nearby' // We'll recalculate
    }));
};

const SalonList = () => {
  const navigate = useNavigate();
  const { setSelectedSalon } = useBooking();
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoc, setUserLoc] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    const fetchSalons = async () => {
        // Get location from localStorage
        const latStr = localStorage.getItem('userLat');
        const lngStr = localStorage.getItem('userLng');

        if (latStr && lngStr) {
          const uLat = parseFloat(latStr);
          const uLng = parseFloat(lngStr);
          setUserLoc({ lat: uLat, lng: uLng });

          try {
              // Fetch real data from Gemini
              const apiSalons = await getNearbySalons(uLat, uLng);
              
              if (apiSalons && apiSalons.length > 0) {
                  const enhanced = enhanceSalons(apiSalons, uLat, uLng);
                  setSalons(enhanced);
              } else {
                  // Fallback to mock if API finds nothing or error
                  loadMockData(uLat, uLng);
              }
          } catch (error) {
              console.error("Failed to load real salons", error);
              loadMockData(uLat, uLng);
          }
        } else {
            // No user location, use mock
            setSalons(MOCK_SALONS);
        }
        setLoading(false);
    };

    fetchSalons();
  }, []);

  const loadMockData = (lat: number, lng: number) => {
      const sortedSalons = [...MOCK_SALONS].map(salon => {
        const dist = calculateDistance(lat, lng, salon.latitude, salon.longitude);
        return { ...salon, distance: `${dist} km` };
      }).sort((a, b) => {
        const distA = parseFloat(a.distance?.split(' ')[0] || '0');
        const distB = parseFloat(b.distance?.split(' ')[0] || '0');
        return distA - distB;
      });
      setSalons(sortedSalons);
  };

  const handleSalonClick = (salon: Salon) => {
      setSelectedSalon(salon);
      navigate(`/salon/${salon.id}`);
  };

  // Fallback if the image URL fails to load
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      e.currentTarget.src = SALON_FALLBACKS[0];
  };

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <Loader2 className="animate-spin text-primary mb-4" size={40} />
              <p className="text-gray-500 font-medium">Finding the best salons near you...</p>
              <p className="text-gray-400 text-sm mt-2">Powered by Gemini & Google Maps</p>
          </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Nearby Salons</h2>
        <p className="text-gray-500">
            {userLoc ? `Showing top results near your location` : `Showing all salons`}
             • {salons.length} results
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {salons.map((salon) => (
          <div 
            key={salon.id}
            onClick={() => handleSalonClick(salon)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer group"
          >
            <div className="relative h-48 overflow-hidden bg-gray-100">
              <img 
                src={salon.image} 
                alt={salon.name} 
                onError={handleImageError}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-semibold flex items-center gap-1 shadow-sm">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                {salon.rating}
                <span className="text-gray-400 font-normal">({salon.reviewCount})</span>
              </div>
              {!salon.isOpen && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide">Closed Now</span>
                </div>
              )}
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{salon.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${salon.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {salon.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
              
              <div className="flex items-center text-gray-500 text-sm mb-4 gap-4">
                <span className="flex items-center gap-1 truncate max-w-[150px]">
                  <MapPin size={14} />
                  {salon.address}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {salon.hours.split(' ')[0]}...
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {salon.services.slice(0, 3).map(service => (
                  <span key={service.id} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100">
                    {service.name}
                  </span>
                ))}
                {salon.services.length > 3 && (
                    <span className="text-xs bg-gray-50 text-gray-400 px-2 py-1 rounded-md border border-gray-100">
                        +{salon.services.length - 3} more
                    </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalonList;

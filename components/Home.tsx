
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Loader2, Navigation, AlertCircle } from 'lucide-react';
import { getLocationName } from '../services/gemini';

const Home = () => {
  const navigate = useNavigate();
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [locationName, setLocationName] = useState<string | null>(localStorage.getItem('userLocationName'));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Try to refine the location name if we have coordinates but no name
    const lat = localStorage.getItem('userLat');
    const lng = localStorage.getItem('userLng');
    if (lat && lng && !locationName) {
        fetchLocationName(parseFloat(lat), parseFloat(lng));
    }
  }, []);

  const fetchLocationName = async (lat: number, lng: number) => {
      const name = await getLocationName(lat, lng);
      setLocationName(name);
      localStorage.setItem('userLocationName', name);
  };

  const handleFindSalons = () => {
    setLoadingLoc(true);
    setErrorMsg(null);
    
    // Clear previous location name to show we are updating
    localStorage.removeItem('userLocationName');
    setLocationName(null);
    
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      setLoadingLoc(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        localStorage.setItem('userLat', lat.toString());
        localStorage.setItem('userLng', lng.toString());
        
        // Fetch human readable name
        await fetchLocationName(lat, lng);
        
        setLoadingLoc(false);
        navigate('/salons');
      },
      (error) => {
        console.warn("Location access denied or failed:", error.message);
        setLoadingLoc(false);
        
        if (error.code === 1) {
            setErrorMsg("Location permission denied. Please enable it in your browser settings or browse default listings.");
        } else if (error.code === 2) {
            setErrorMsg("Location information is unavailable right now.");
        } else if (error.code === 3) {
            setErrorMsg("Location request timed out.");
        } else {
            setErrorMsg("An error occurred while getting your location.");
        }
      },
      {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
      }
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col relative bg-gray-50">
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Salon Background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center pb-20">
        
        {/* Location Display Pill */}
        <div className="bg-white/80 backdrop-blur-md border border-white/50 shadow-sm text-gray-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 inline-flex items-center gap-2 animate-fade-in-up">
           {locationName ? (
               <><MapPin size={16} className="text-primary" /> {locationName}</>
           ) : (
               <><Navigation size={16} className="text-primary" /> {loadingLoc ? 'Locating...' : 'Discover Salons Near You'}</>
           )}
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight max-w-4xl">
          Look Good, <br className="hidden md:block"/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Feel Amazing.</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
          Book appointments with the best hairstylists, beauticians, and wellness experts in your city with just a few clicks.
        </p>

        <button 
          onClick={handleFindSalons}
          disabled={loadingLoc}
          className="group relative inline-flex items-center justify-center gap-3 bg-primary hover:bg-indigo-700 text-white text-lg font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loadingLoc ? <Loader2 className="animate-spin" size={22} /> : <Search size={22} className="group-hover:rotate-12 transition-transform" />}
          {loadingLoc ? 'Locating...' : 'Use My Location & Find Salons'}
        </button>

        {errorMsg ? (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm max-w-md mx-auto animate-fade-in flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2 font-semibold">
                    <AlertCircle size={16} />
                    <span>Unable to get location</span>
                </div>
                <p className="mb-3">{errorMsg}</p>
                <button 
                    onClick={() => navigate('/salons')}
                    className="text-red-700 underline hover:text-red-900 font-medium"
                >
                    Browse salons in default location
                </button>
            </div>
        ) : (
            <p className="mt-4 text-sm text-gray-500">
                {locationName ? `Searching near ${locationName}` : 'We need your permission to find the best spots nearby.'}
            </p>
        )}

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center opacity-80">
           <div>
              <p className="text-3xl font-bold text-gray-900">500+</p>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Salons</p>
           </div>
           <div>
              <p className="text-3xl font-bold text-gray-900">24/7</p>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Booking</p>
           </div>
           <div>
              <p className="text-3xl font-bold text-gray-900">50k+</p>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Users</p>
           </div>
           <div>
              <p className="text-3xl font-bold text-gray-900">4.9</p>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Rating</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

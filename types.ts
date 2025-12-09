export interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
}

export interface Salon {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  distance?: string; // Display string
  isOpen: boolean;
  address: string;
  description: string;
  hours: string;
  services: Service[];
  latitude: number;
  longitude: number;
}

export interface Booking {
  id: string;
  salonName: string;
  salonAddress: string;
  serviceName: string;
  date: string;
  time: string;
  qrValue: string;
  timestamp: number;
}

export interface User {
  email: string;
  password?: string;
  name: string;
  phone?: string;
  gender?: string;
  preferences?: string[];
  recentBookings: Booking[];
}

export interface BookingContextType {
  selectedSalon: Salon | null;
  selectedService: Service | null;
  selectedDate: Date | null;
  selectedSlot: string | null;
  setSelectedSalon: (salon: Salon | null) => void;
  setSelectedService: (service: Service | null) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedSlot: (slot: string | null) => void;
  resetBooking: () => void;
}

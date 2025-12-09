
import React from 'react';
import { Salon, Service, BookingContextType } from './types';

const BookingContext = React.createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [selectedSalon, setSelectedSalon] = React.useState<Salon | null>(() => {
    const saved = localStorage.getItem('selectedSalon');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedService, setSelectedService] = React.useState<Service | null>(() => {
    const saved = localStorage.getItem('selectedService');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedDate, setSelectedDate] = React.useState<Date | null>(() => {
    const saved = localStorage.getItem('selectedDate');
    return saved ? new Date(saved) : null;
  });

  const [selectedSlot, setSelectedSlot] = React.useState<string | null>(() => {
    return localStorage.getItem('selectedSlot');
  });

  // Sync to localStorage
  React.useEffect(() => {
    if (selectedSalon) localStorage.setItem('selectedSalon', JSON.stringify(selectedSalon));
    else localStorage.removeItem('selectedSalon');
  }, [selectedSalon]);

  React.useEffect(() => {
    if (selectedService) localStorage.setItem('selectedService', JSON.stringify(selectedService));
    else localStorage.removeItem('selectedService');
  }, [selectedService]);

  React.useEffect(() => {
    if (selectedDate) localStorage.setItem('selectedDate', selectedDate.toISOString());
    else localStorage.removeItem('selectedDate');
  }, [selectedDate]);

  React.useEffect(() => {
    if (selectedSlot) localStorage.setItem('selectedSlot', selectedSlot);
    else localStorage.removeItem('selectedSlot');
  }, [selectedSlot]);

  const resetBooking = () => {
    setSelectedSalon(null);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    localStorage.removeItem('selectedSalon');
    localStorage.removeItem('selectedService');
    localStorage.removeItem('selectedDate');
    localStorage.removeItem('selectedSlot');
  };

  return (
    <BookingContext.Provider
      value={{
        selectedSalon,
        selectedService,
        selectedDate,
        selectedSlot,
        setSelectedSalon,
        setSelectedService,
        setSelectedDate,
        setSelectedSlot,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = React.useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

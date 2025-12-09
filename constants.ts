
import { Salon } from './types';

// Centered around a mock city center (approx 40.7128, -74.0060 for NYC example)
export const MOCK_SALONS: Salon[] = [
  {
    id: '1',
    name: 'Glow & Style Studio',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 124,
    isOpen: true,
    address: '123 Fashion Ave, Downtown',
    description: 'Experience premium styling and relaxation at Glow & Style. We specialize in modern cuts and color treatments.',
    hours: 'Mon-Sat: 9:00 AM - 8:00 PM',
    latitude: 40.7128,
    longitude: -74.0060,
    services: [
      { id: 's1', name: 'Haircut & Blowdry', price: 320, duration: '45m' },
      { id: 's2', name: 'Full Hair Color', price: 4500, duration: '2h' },
      { id: 's3', name: 'Manicure', price: 600, duration: '30m' },
    ]
  },
  {
    id: '2',
    name: 'Urban Oasis Spa',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    reviewCount: 89,
    isOpen: true,
    address: '45 Wellness Way, Uptown',
    description: 'A sanctuary for your beauty needs. Organic products and serene atmosphere.',
    hours: 'Mon-Sun: 10:00 AM - 9:00 PM',
    latitude: 40.7282,
    longitude: -73.9942,
    services: [
      { id: 's4', name: 'Facial Treatment', price: 2500, duration: '1h' },
      { id: 's5', name: 'Deep Tissue Massage', price: 3000, duration: '1h' },
      { id: 's6', name: 'Pedicure', price: 800, duration: '45m' },
    ]
  },
  {
    id: '3',
    name: 'The Barber Collective',
    image: 'https://images.unsplash.com/photo-1503951914875-befbb7135952?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 210,
    isOpen: false,
    address: '88 Gentlemans Row',
    description: 'Classic cuts for the modern man. Hot towel shaves and beard trims available.',
    hours: 'Tue-Sat: 8:00 AM - 6:00 PM',
    latitude: 40.7589,
    longitude: -73.9851,
    services: [
      { id: 's7', name: 'Classic Haircut', price: 250, duration: '30m' },
      { id: 's8', name: 'Beard Trim', price: 250, duration: '20m' },
      { id: 's9', name: 'Hot Towel Shave', price: 500, duration: '45m' },
    ]
  },
  {
    id: '4',
    name: 'Luxe Locks Lounge',
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80',
    rating: 4.2,
    reviewCount: 56,
    isOpen: true,
    address: '500 Shiny St, Westside',
    description: 'Where luxury meets affordability. Walk-ins welcome.',
    hours: 'Mon-Fri: 9:00 AM - 7:00 PM',
    latitude: 40.7549,
    longitude: -73.9940,
    services: [
      { id: 's10', name: 'Blowout', price: 220, duration: '45m' },
      { id: 's11', name: 'Keratin Treatment', price: 8000, duration: '3h' },
    ]
  },
    {
    id: '5',
    name: 'Zen Beauty Bar',
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 142,
    isOpen: true,
    address: '77 Peace Blvd',
    description: 'Holistic beauty services for mind and body.',
    hours: 'Wed-Sun: 10:00 AM - 6:00 PM',
    latitude: 40.7410,
    longitude: -73.9990,
    services: [
      { id: 's12', name: 'Gel Manicure', price: 1200, duration: '50m' },
      { id: 's13', name: 'Aromatherapy Facial', price: 3500, duration: '1h 15m' },
    ]
  }
];

export const TIME_SLOTS = {
  Morning: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  Afternoon: ['12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'],
  Evening: ['04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM']
};

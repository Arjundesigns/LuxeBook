import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { BookingProvider } from './BookingContext';
import { AuthProvider } from './AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import SalonList from './components/SalonList';
import SalonDetails from './components/SalonDetails';
import SlotSelection from './components/SlotSelection';
import BookingConfirmation from './components/BookingConfirmation';
import BookingSuccess from './components/BookingSuccess';
import Login from './components/Login';
import Signup from './components/Signup';
import Onboarding from './components/Onboarding';
import Profile from './components/Profile';

const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  const location = useLocation();
  // Don't show Navbar on auth pages or success page for cleaner look
  const hideNavbar = ['/success', '/login', '/signup', '/onboarding'].includes(location.pathname);
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {!hideNavbar && <Navbar />}
      <main>
        {children}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/salons" element={<SalonList />} />
              <Route path="/salon/:id" element={<SalonDetails />} />
              <Route path="/slots" element={<SlotSelection />} />
              <Route path="/confirm" element={<BookingConfirmation />} />
              <Route path="/success" element={<BookingSuccess />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Layout>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
};

export default App;

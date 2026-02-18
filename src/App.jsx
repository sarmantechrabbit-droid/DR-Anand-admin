import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Reports from './pages/Reports';
import Testimonials from './pages/Testimonials';
import Settings from './pages/Settings';
import Blogs from './pages/Blogs';
import FAQs from './pages/FAQs';
import Inquiries from './pages/Inquiries';
import ChangePassword from './pages/ChangePassword';
import AddAppointment from './pages/AddAppointment';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="appointments/add" element={<AddAppointment />} />
              {/* <Route path="reports" element={<Reports />} /> */}
            <Route path="testimonials" element={<Testimonials />} />
           <Route path="blogs" element={<Blogs />} />
            <Route path="faqs" element={<FAQs />} />
            <Route path="inquiries" element={<Inquiries />} />
            <Route path="settings" element={<Settings />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

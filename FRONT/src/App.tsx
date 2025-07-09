// src/App.tsx
import LandingPage from './components/pages/LandingPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import AdminLayout from './components/admin/layout/AdminLayout';
import UserLayout from './components/users/landingUsers/UserLayout';
import AdminFormationsPage from './components/admin/formations/AdminFormationPage';
import AllDomains from './components/landing/AllDomain';
import DomaineDetail from './components/landing/DomaineDetail';
import OtherFormation from './components/users/landingUsers/OtherFormation';
import FormationDetail from './components/users/landingUsers/FormationDetail';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext';
import MyFormation from './components/users/landingUsers/MyFormation';
import MyFormationDetail from './components/users/landingUsers/MyFormationDetail';
import AdminFormationApproval from './components/admin/StudentList/AdminFormationApproval';
import ProtectedRoute from './components/ProtectedRoute';
import About from './components/landing/About';
import EditFormation from './components/admin/formationModal/EditFormationModal';
import AdminDashboard from './components/admin/dashboard/DashboardAdmin';
import LoginAdmin from './components/auth/LoginAdmin';
import ProfLogin from './components/auth/LoginProf';
import ProfStudents from './components/Prof/ProfStudents';
import FormationDetailLanding from './components/landing/DetailsFormLanding';
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Durée des animations en ms
      once: true,     // Animation une seule fois
    });
  }, [])  
  return (
    <AuthProvider>
      <BrowserRouter>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/LoginAdmin" element={<LoginAdmin />} />
          <Route path="/LoginProf" element={<ProfLogin />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/formation/:id" element={<FormationDetailLanding />} />
          <Route path="/domaine/:id" element={<DomaineDetail />} />
          <Route path="/Alldomain" element={<AllDomains />} />
          <Route path="/About" element={<About />} />
          

          {/* <Route element={<ProtectedRoute />}> */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="Acceuil" element={<AdminLayout />} />
            <Route path="Dashboard" element={<AdminDashboard />} />
            <Route path="Formations" element={<AdminFormationsPage />} />
            <Route path="Parametres" element={<EditFormation />} />
            <Route path="Etudiants" element={<AdminFormationApproval />} />
          </Route>
          {/* </Route> */}
          <Route path="/loginAdmin" element={<Navigate to="/LoginAdmin" />} />
          

          <Route element={<ProtectedRoute />}>
            <Route path="/user" element={<UserLayout />}>
              <Route path="Myformation" element={<MyFormation />} />
              <Route path="otherFormation" element={<OtherFormation />} />
              <Route path="formation/:id" element={<FormationDetail />} />
              <Route path="myformationDetail/:id" element={<MyFormationDetail />} />
            </Route>
          </Route>
          <Route path="/login" element={<Navigate to="/login" />} />

          <Route>
            <Route path="/prof" element={<ProfStudents/>}/>
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
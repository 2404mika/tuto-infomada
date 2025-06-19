import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLayout from './components/admin/layout/AdminLayout';
import UserLayout from './components/users/landingUsers/UserLayout';
import AdminFormationsPage from './components/admin/formations/AdminFormationPage';
import AllDomains from './components/landing/AllDomain';
import DomaineDetail from './components/landing/DomaineDetail';
import OtherFormation from './components/users/landingUsers/OtherFormation';
import FormationDetail from './components/users/landingUsers/FormationDetail';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MyFormation from './components/users/landingUsers/MyFormation';
import MyFormationDetail from './components/users/MyFormationDetail';
import AdminFormationApproval from './components/admin/StudentList/AdminFormationApproval';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/domaine/:id" element={<DomaineDetail />} />
          <Route path="/Alldomain" element={<AllDomains />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="Acceuil" element={<AdminLayout />} />
            <Route path="Dashboard" element={<AdminLayout />} />
            <Route path="Formations" element={<AdminFormationsPage />} />
            <Route path="Parametres" element={<AdminLayout />} />
            <Route path="Etudiants" element={<AdminFormationApproval />} />
          </Route>

          <Route path="/user" element={<UserLayout />}>
            <Route path="Myformation" element={<MyFormation />} />
            <Route path="otherFormation" element={<OtherFormation />} />
            <Route path="formation/:id" element={<FormationDetail />} /> 
            <Route path="myformationDetail/:id" element={<MyFormationDetail />} /> 
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
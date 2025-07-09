import React, { ReactNode } from 'react';
import { Laptop } from 'lucide-react';
import { Link } from '../common/Link';
import { useNavigate } from 'react-router-dom';
interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col md:flex-row">
      
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-violet-600 text-white p-12 flex-col justify-between">
        <div className="flex items-center gap-2 mb-12">
          
          <a  onClick={()=> navigate("/landing")} className="text-2xl font-bold flex cursor-pointer"> <Laptop size={32} /> INFOMADA</a>
        </div>
        
        <div className="mb-auto">
          <h1 className="text-4xl font-bold mb-6">Développez vos connaissances avec nos cours en ligne</h1>
          <p className="text-lg text-blue-100 mb-8">Transformez vos ambitions en réalité avec l'accompagnement de nos formateurs passionnés</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">Apprenez à vos rythmes</h3>
              <p className="text-blue-100">Accédez aux cours à tout moment, n'importe où, et apprenez selon votre propre emploi du temps</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">Instructeurs experts</h3>
              <p className="text-blue-100">Apprenez auprès de INFOMADA ayant des années d'expériences</p>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-blue-200 text-center">
          © {new Date().getFullYear()} INFOMADA. Tous droits réservés.
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            
            <Link href="/landing" className="text-xl font-bold text-blue-600 flex"><Laptop size={28} className="text-blue-600" />INFOMADA</Link>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600 mb-8">{subtitle}</p>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
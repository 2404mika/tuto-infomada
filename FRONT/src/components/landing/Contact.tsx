import React from 'react';
import { FaWhatsapp, FaFacebook } from "react-icons/fa";

const Contact: React.FC = () => {
  return (
    <footer className=" text-gray-800 py-6 px-4 sm:px-6 lg:px-8 mt-16" data-aos="fade-up"
    data-aos-anchor-placement="bottom-center">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Navigation</h3>
          <ul className="space-y-2">
            <li><a href="/formations" className="hover:text-blue-400 transition-colors">Formations</a></li>
            <li><a href="/about" className="hover:text-blue-400 transition-colors">À propos</a></li>
            <li><a href="/contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact</h3>
          <p>Email: infomada@yahoo.com</p>
          <p>Téléphone: +261 34 290 75</p>
          <p>Adresse: Anosizato Andrefana, Antananarivo, Madagascar</p>
        </div>

        {/* Social & Copyright */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Suivez-nous</h3>
          <p className="text-sm">Restez connecté avec nous sur les réseaux sociaux :</p>
          <div className="flex space-x-4">
            <a href="https://web.facebook.com/infomadamdg" className="hover:text-blue-400"><FaFacebook className='text-2xl'/></a>
            <a href="https://wa.me/+261345929075" className="hover:text-blue-400"><FaWhatsapp className='text-2xl'/></a>
            {/* <a href="https://gmail.com" className="hover:text-blue-400"><Famail/></a> */}
          </div>
          <p className="text-sm mt-4">&copy; {new Date().getFullYear()} INFOMADA. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
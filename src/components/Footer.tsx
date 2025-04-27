
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-tourism-dark text-white py-12 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold">
              <span className="text-tourism-teal">Compass</span>
              <span className="text-tourism-blue">Charm</span>
            </h2>
            <p className="text-gray-300 mt-2">Your personal travel companion</p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-300 hover:text-white transition">About</a>
            <a href="#" className="text-gray-300 hover:text-white transition">Contact</a>
            <a href="#" className="text-gray-300 hover:text-white transition">Privacy</a>
            <a href="#" className="text-gray-300 hover:text-white transition">Terms</a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6">
          <p className="text-gray-400 text-sm text-center">
            Made with <Heart className="h-3 w-3 inline text-red-400 mx-1" fill="currentColor" /> in 2025. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

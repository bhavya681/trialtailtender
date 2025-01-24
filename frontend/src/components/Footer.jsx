import React from 'react';
import { Dog, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 -left-48 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 -right-48 w-96 h-96 bg-violet-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-6 gap-12 lg:gap-16">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl group-hover:from-blue-600 group-hover:to-violet-600 transition-all duration-300">
                <Dog className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">PetCare</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Revolutionizing pet care management through innovative technology. Connecting pet parents with premium care services and expert veterinarians for a better pet care experience.
            </p>
            <div className="flex space-x-5">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="group p-2 bg-gray-800/50 hover:bg-gradient-to-br hover:from-blue-500 hover:to-violet-500 rounded-lg transition-all duration-300"
                >
                  <Icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>
          
          {[
            {
              title: "Services",
              links: ["Veterinary Care", "Health Records", "Appointments", "Pet Insurance"]
            },
            {
              title: "Company",
              links: ["About Us", "Careers", "Blog", "Contact"]
            },
            {
              title: "Resources",
              links: ["Help Center", "Partners", "Community", "Testimonials"]
            },
            {
              title: "Legal",
              links: ["Privacy Policy", "Terms of Service", "Cookie Policy"]
            }
          ].map((column, index) => (
            <div key={index} className="col-span-1">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-4">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400">&copy; {currentYear} PawCare. All rights reserved.</p>
            <div className="flex items-center space-x-6">
              {["Terms", "Privacy", "Cookies"].map((item, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 relative group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import { Calendar, Shield, MessageCircle, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Effortlessly book and manage appointments with our intuitive calendar system."
  },
  {
    icon: Shield,
    title: "Health Tracking",
    description: "Comprehensive health records and vaccination tracking in one secure place."
  },
  {
    icon: MessageCircle,
    title: "24/7 Vet Support",
    description: "Connect with qualified veterinarians anytime through our platform."
  },
  {
    icon: PawPrint,
    title: "Pet Profile",
    description: "Create detailed profiles for all your pets with medical history and care preferences."
  }
];

const FeatureCard = ({ icon: Icon, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
        <Icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </motion.div>
  );
};

const Features = () => {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-indigo-50/80 to-white"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-0 -left-48 w-96 h-96 bg-blue-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 -right-48 w-96 h-96 bg-violet-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
              Why Choose PawCare?
            </span>
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to provide the best care for your pets, powered by innovative technology
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <FeatureCard {...feature} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
import { useState } from 'react';
import { Dog, Menu, X, ChevronRight, Calendar, Shield, MessageCircle } from 'lucide-react';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import Features from '../components/Features';

function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-b mt-8 from-white via-blue-50 to-white">
            <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden">
                {/* Animated background patterns */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] animate-[pulse_10s_ease-in-out_infinite]"></div>
                
                {/* Floating geometric shapes */}
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-violet-400/10 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full mix-blend-multiply filter blur-xl animate-float-delayed"></div>
                <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full mix-blend-multiply filter blur-xl animate-float-slow"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left Content Section */}
                        <div className="relative z-10 space-y-8 text-center lg:text-left">
                            <div className="inline-block animate-fade-in-up">
                                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-violet-500/10 text-blue-600 text-sm font-medium">
                                    #1 Pet Care Platform
                                </span>
                            </div>
                            
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight animate-fade-in-up animation-delay-150">
                                <span className="inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-transparent bg-clip-text bg-300% animate-gradient">
                                    Find Your Pet's
                                </span>
                                <br />
                                <span className="inline-block text-gray-800">Perfect Companion</span>
                            </h1>

                            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-300">
                                Experience premium pet care with our network of certified sitters who treat your pets like family. Available 24/7, trusted by thousands.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start animate-fade-in-up animation-delay-450">
                                <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white font-medium overflow-hidden transform hover:scale-105 transition-all duration-300">
                                    <span className="relative z-10 flex items-center justify-center">
                                        Get Started Now
                                        <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                                
                                <button className="group px-8 py-4 rounded-2xl border-2 border-transparent bg-white/80 backdrop-blur-sm hover:border-indigo-600 text-gray-700 hover:text-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
                                    Watch Demo
                                </button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-fade-in-up animation-delay-600">
                                <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                                    <Shield className="h-6 w-6 text-indigo-600" />
                                    <div>
                                        <div className="font-semibold text-gray-800">Verified</div>
                                        <div className="text-sm text-gray-500">Pet Sitters</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                                    <Calendar className="h-6 w-6 text-indigo-600" />
                                    <div>
                                        <div className="font-semibold text-gray-800">24/7</div>
                                        <div className="text-sm text-gray-500">Support</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 sm:col-span-1 col-span-2">
                                    <MessageCircle className="h-6 w-6 text-indigo-600" />
                                    <div>
                                        <div className="font-semibold text-gray-800">15,000+</div>
                                        <div className="text-sm text-gray-500">Happy Clients</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Image Section */}
                        <div className="relative lg:mt-0 animate-fade-in-up animation-delay-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-violet-100 transform rotate-6 rounded-[2.5rem] scale-105"></div>
                            <div className="relative rounded-[2.5rem] overflow-hidden group">
                                <img 
                                    src="https://images.unsplash.com/photo-1587764379873-97837921fd44?auto=format&fit=crop&q=80" 
                                    alt="Professional pet care" 
                                    className="w-full h-[600px] sm:h-[700px] lg:h-[600px] object-cover transform transition-all duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                
                                {/* Floating Stats Card */}
                                <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-lg p-6 rounded-2xl shadow-2xl transform transition-all duration-300 group-hover:translate-x-2 group-hover:-translate-y-2">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-50 rounded-xl">
                                            <Dog className="h-8 w-8 text-indigo-600" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-800">5,000+</div>
                                            <div className="text-sm text-gray-600">Professional Sitters</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Features />
            <Testimonials />
            <CTA />
        </div>
    );
}

export default Home;

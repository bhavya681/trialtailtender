import React, { useState } from 'react';
import { Eye, EyeOff, Mail, LockKeyhole, User, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DummyTest() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: ''
  });

  const getPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const getStrengthColor = (strength) => {
    switch(strength) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getStrengthText = (strength) => {
    switch(strength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-blue-100/50 p-8">
        <form className="space-y-4">
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400 group-hover:text-blue-600 transition-colors" />
            <input 
              placeholder="Full Name"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-blue-200 text-sm"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="relative group">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400 group-hover:text-blue-600 transition-colors" />
            <input 
              placeholder="Mobile Number"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-blue-200 text-sm"
              type="tel"
              value={formData.mobile}
              onChange={(e) => setFormData({...formData, mobile: e.target.value})}
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400 group-hover:text-blue-600 transition-colors" />
            <input 
              placeholder="Email Address"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-blue-200 text-sm"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <div className="relative group">
              <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400 group-hover:text-blue-600 transition-colors" />
              <input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-blue-200 text-sm"
              />
              <button
                type="button"
                className="absolute right-0 top-1/2 -translate-y-1/2 px-3 text-gray-400 hover:text-blue-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {password && (
              <div className="mt-2">
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getStrengthColor(getPasswordStrength(password))} transition-all duration-300`}
                    style={{ width: `${(getPasswordStrength(password) / 4) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-1 text-gray-600">
                  Password Strength: {getStrengthText(getPasswordStrength(password))}
                </p>
              </div>
            )}
          </div>
          <p className="text-center text-sm text-gray-500">
            Already have an account? 
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
              Login
            </Link>
          </p>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-md shadow-blue-500/25 flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] transform text-sm"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );}
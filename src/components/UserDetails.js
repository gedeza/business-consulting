
import React, { useState } from 'react';
import { validateEmail, validatePhone, validateVATNumber, sanitizeInput } from '../utils/validation';

const UserDetails = ({ consultantProfile, setConsultantProfile, businessName, setBusinessName, handleSaveDetails }) => {
  const [errors, setErrors] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const validateField = (field, value) => {
    let error = '';
    switch (field) {
      case 'email':
        if (value && !validateEmail(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (value && !validatePhone(value)) {
          error = 'Please enter a valid South African phone number';
        }
        break;
      case 'vatNumber':
        if (value && !validateVATNumber(value)) {
          error = 'Please enter a valid South African VAT number';
        }
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
    return error === '';
  };
  
  const handleInputChange = (field, value) => {
    const sanitizedValue = sanitizeInput(value);
    if (field === 'email' || field === 'phone' || field === 'vatNumber') {
      validateField(field, sanitizedValue);
    }
    
    if (field === 'businessName') {
      setBusinessName(sanitizedValue);
    } else {
      setConsultantProfile({ ...consultantProfile, [field]: sanitizedValue });
    }
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    // Validate all fields before saving
    const emailValid = !consultantProfile.email || validateField('email', consultantProfile.email);
    const phoneValid = !consultantProfile.phone || validateField('phone', consultantProfile.phone);
    const vatValid = !consultantProfile.vatNumber || validateField('vatNumber', consultantProfile.vatNumber);
    
    if (emailValid && phoneValid && vatValid) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      handleSaveDetails();
    } else {
      alert('Please fix the validation errors before saving.');
    }
    setIsSaving(false);
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-lg mb-8 border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-gray-800">Consultant Profile</h4>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden flex items-center px-3 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm mr-2">{isExpanded ? 'Hide' : 'Show'}</span>
            <svg 
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className={`p-6 ${isExpanded || window.innerWidth >= 1024 ? 'block' : 'hidden lg:block'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="sm:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-3">Business Name *</label>
            <input 
              type="text" 
              className="w-full p-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100" 
              value={businessName} 
              onChange={e => handleInputChange('businessName', e.target.value)}
              placeholder="Your Business Name"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-3">Consultant Name *</label>
            <input 
              type="text" 
              className="w-full p-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100" 
              value={consultantProfile.name} 
              onChange={e => handleInputChange('name', e.target.value)}
              placeholder="Your Full Name"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-3">Professional Title</label>
            <input 
              type="text" 
              className="w-full p-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100" 
              value={consultantProfile.title} 
              onChange={e => handleInputChange('title', e.target.value)}
              placeholder="Senior Business Consultant"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-3">Email Address *</label>
            <input 
              type="email" 
              className={`w-full p-4 text-gray-700 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              value={consultantProfile.email} 
              onChange={e => handleInputChange('email', e.target.value)}
              placeholder="your.email@domain.com"
              required
            />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-3">Phone Number</label>
            <input 
              type="tel" 
              className={`w-full p-4 text-gray-700 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              value={consultantProfile.phone || ''} 
              onChange={e => handleInputChange('phone', e.target.value)}
              placeholder="+27 12 345 6789"
            />
            {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-3">VAT Number</label>
            <input 
              type="text" 
              className={`w-full p-4 text-gray-700 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 ${
                errors.vatNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              value={consultantProfile.vatNumber || ''} 
              onChange={e => handleInputChange('vatNumber', e.target.value)}
              placeholder="4123456789"
            />
            {errors.vatNumber && <p className="mt-2 text-sm text-red-600">{errors.vatNumber}</p>}
            <p className="mt-2 text-sm text-gray-500">10-digit VAT number starting with 4-7</p>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-3">B-BBEE Status</label>
            <select 
              className="w-full p-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 appearance-none"
              value={consultantProfile.bbbeeStatus || ''} 
              onChange={e => handleInputChange('bbbeeStatus', e.target.value)}
            >
              <option value="">Select B-BBEE Level</option>
              <option value="Level 1">Level 1</option>
              <option value="Level 2">Level 2</option>
              <option value="Level 3">Level 3</option>
              <option value="Level 4">Level 4</option>
              <option value="Level 5">Level 5</option>
              <option value="Level 6">Level 6</option>
              <option value="Level 7">Level 7</option>
              <option value="Level 8">Level 8</option>
              <option value="Non-Compliant">Non-Compliant</option>
              <option value="Exempted Micro Enterprise">Exempted Micro Enterprise</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-3">CIPC Registration Number</label>
            <input 
              type="text" 
              className="w-full p-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100" 
              value={consultantProfile.cipcNumber || ''} 
              onChange={e => handleInputChange('cipcNumber', e.target.value)}
              placeholder="2021/123456/07"
            />
            <p className="mt-2 text-sm text-gray-500">CIPC Company Registration Number</p>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-3">SARS Tax Reference</label>
            <input 
              type="text" 
              className="w-full p-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100" 
              value={consultantProfile.sarsTaxRef || ''} 
              onChange={e => handleInputChange('sarsTaxRef', e.target.value)}
              placeholder="9876543210"
            />
            <p className="mt-2 text-sm text-gray-500">SARS Income Tax Reference Number</p>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-3">Logo URL</label>
            <input 
              type="url" 
              className="w-full p-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100" 
              value={consultantProfile.logo || ''} 
              onChange={e => handleInputChange('logo', e.target.value)}
              placeholder="https://yourdomain.com/logo.png"
            />
            <p className="mt-2 text-sm text-gray-500">Optional: URL to your company logo</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600 mb-4 sm:mb-0">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Data encrypted and stored securely (POPIA compliant)
          </div>
          <button 
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Profile
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

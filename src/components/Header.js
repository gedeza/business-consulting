
import React from 'react';

const Header = () => {
  return (
    <header className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-12 px-6 rounded-2xl shadow-xl mb-8 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full -translate-x-12 -translate-y-12"></div>
      </div>
      
      <div className="relative text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Consulting Service
            <span className="block text-3xl md:text-4xl font-light">Cost Estimator</span>
          </h1>
        </div>
        
        <p className="text-lg md:text-xl text-white text-opacity-90 mb-6 max-w-2xl mx-auto">
          Professional South African business consulting services with transparent pricing and expert guidance
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            South Africa
          </div>
          <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            VAT Compliant
          </div>
          <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            POPIA Secure
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

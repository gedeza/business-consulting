import React, { useState } from 'react';
import { sanitizeInput } from '../utils/validation';

const ProjectDetails = ({ clientName, setClientName, projectName, setProjectName, clients, onSelectExistingClient }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  
  const handleInputChange = (field, value) => {
    const sanitizedValue = sanitizeInput(value);
    if (field === 'clientName') {
      setClientName(sanitizedValue);
    } else if (field === 'projectName') {
      setProjectName(sanitizedValue);
    }
  };
  
  const handleClientSelect = (clientId) => {
    setSelectedClientId(clientId);
    onSelectExistingClient(clientId);
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-lg mb-8 border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-gray-800">Project & Client Details</h4>
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
        {clients.length > 0 && (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-3">Quick Select from Existing Clients</label>
            <div className="relative">
              <select 
                className="w-full p-4 pr-12 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none transition-all duration-200 hover:bg-gray-100" 
                value={selectedClientId}
                onChange={e => handleClientSelect(e.target.value)}
              >
                <option value="">-- Select a Previous Client --</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} {client.company ? `(${client.company})` : ''}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">Or enter new client details below</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-3">Client Name *</label>
            <div className="relative">
              <input 
                type="text" 
                className="w-full p-4 pl-12 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100" 
                value={clientName} 
                onChange={e => handleInputChange('clientName', e.target.value)}
                placeholder="Enter client or company name"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-3">Project Title *</label>
            <div className="relative">
              <input 
                type="text" 
                className="w-full p-4 pl-12 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100" 
                value={projectName} 
                onChange={e => handleInputChange('projectName', e.target.value)}
                placeholder="Enter project or proposal title"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tip: You can manage all your clients in the Clients section for faster project setup
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
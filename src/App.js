
import React, { useState, useEffect } from 'react';
import { encrypt, decrypt, safeJsonParse } from './utils/encryption';
import { validateFundingValue, validateHourlyRate } from './utils/validation';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { services } from './servicesData';
import Header from './components/Header';
import UserDetails from './components/UserDetails';
import ProjectDetails from './components/ProjectDetails';
import ServiceEstimator from './components/ServiceEstimator';
import Quote from './components/Quote';
import ClientManagement from './components/ClientManagement';
import ErrorBoundary from './components/ErrorBoundary';
import LanguageSelector from './components/LanguageSelector';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  // State for user and project details
  const [consultantProfile, setConsultantProfile] = useState({ name: '', title: '', email: '' });
  const [businessName, setBusinessName] = useState('');
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [clients, setClients] = useState([]);

  // State for the estimator
  const [selectedService, setSelectedService] = useState('');
  const [hourlyRate, setHourlyRate] = useState(1000); // Default to ZAR
  const [currency, setCurrency] = useState('ZAR');
  const [complexity, setComplexity] = useState(1);
  const [numDocuments, setNumDocuments] = useState(1);
  const [partialGroundwork, setPartialGroundwork] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [polishingPercentage, setPolishingPercentage] = useState(20); // Default to 20% for polishing
  const [vatEnabled, setVatEnabled] = useState(true); // Default to VAT enabled
  const [exchangeRates, setExchangeRates] = useState({ ZAR: 1, USD: 0.054, EUR: 0.05 }); // Fallback rates

  // New state for percentage-based pricing
  const [pricingModel, setPricingModel] = useState('hourly'); // 'hourly' or 'percentage'
  const [fundingValue, setFundingValue] = useState(0);
  const [supportType, setSupportType] = useState('full'); // 'full' or 'admin'

  // State for the final quote
  const [quote, setQuote] = useState(null);

  // Load user details and clients from local storage on initial render
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('consultantProfile');
      const savedBusinessName = localStorage.getItem('businessName');
      const savedClients = localStorage.getItem('clients');

      if (savedProfile) {
        const decryptedProfile = decrypt(savedProfile);
        if (decryptedProfile) {
          setConsultantProfile(safeJsonParse(decryptedProfile, { name: '', title: '', email: '' }));
        }
      }
      if (savedBusinessName) {
        const decryptedName = decrypt(savedBusinessName);
        if (decryptedName) setBusinessName(decryptedName);
      }
      if (savedClients) {
        const decryptedClients = decrypt(savedClients);
        if (decryptedClients) {
          setClients(safeJsonParse(decryptedClients, []));
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);

  // Save clients to local storage whenever the clients state changes
  useEffect(() => {
    try {
      if (clients.length > 0) {
        localStorage.setItem('clients', encrypt(JSON.stringify(clients)));
      }
    } catch (error) {
      console.error('Error saving clients:', error);
    }
  }, [clients]);

  // Fetch latest exchange rates
  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/ZAR')
      .then(response => response.json())
      .then(data => {
        setExchangeRates(data.rates);
      })
      .catch(error => console.error("Error fetching exchange rates:", error));
  }, []);

  // Save user details to local storage
  const handleSaveDetails = () => {
    try {
      localStorage.setItem('consultantProfile', encrypt(JSON.stringify(consultantProfile)));
      localStorage.setItem('businessName', encrypt(businessName));
      alert('Your details have been saved securely!');
    } catch (error) {
      console.error('Error saving details:', error);
      alert('Failed to save details. Please try again.');
    }
  };

  const handleTaskToggle = (taskName) => {
    setCompletedTasks(prev =>
      prev.includes(taskName) ? prev.filter(t => t !== taskName) : [...prev, taskName]
    );
  };

  const generateQuote = () => {
    // Enhanced validation
    if (!selectedService) {
      alert('Please select a service.');
      return;
    }
    
    if (!clientName.trim()) {
      alert('Please enter a client name.');
      return;
    }
    
    if (!projectName.trim()) {
      alert('Please enter a project name.');
      return;
    }

    let finalCost = 0;
    let finalHours = 0;
    let vatAmount = 0;
    let securityFee = 0;
    let supportFee = 0;
    let service = null;

    if (pricingModel === 'hourly') {
      // Get service from either built-in services or localStorage custom services
      service = services[selectedService];
      if (!service) {
        try {
          const customServices = JSON.parse(localStorage.getItem('customServices') || '{}');
          service = customServices[selectedService];
        } catch (error) {
          console.error('Error loading custom services:', error);
        }
      }
      
      if (!service) {
        alert('Selected service not found.');
        return;
      }
      
      let totalHours = 0;

      service.tasks.forEach(task => {
        let taskHours = task.hours;
        if (partialGroundwork && completedTasks.includes(task.name)) {
          taskHours *= (polishingPercentage / 100);
        }
        if (task.perDocument) {
          taskHours *= numDocuments;
        }
        totalHours += taskHours;
      });

      if (!validateHourlyRate(hourlyRate)) {
        alert('Please enter a valid hourly rate between R100 and R10,000.');
        return;
      }
      
      finalHours = totalHours * complexity;
      finalCost = finalHours * hourlyRate;

    } else if (pricingModel === 'percentage') {
      if (!validateFundingValue(fundingValue)) {
        alert('Please enter a valid funding value between R10,000 and R10,000,000,000.');
        return;
      }

      const SECURITY_FEE_BASE = 25000;
      const VAT_RATE = 0.15;
      securityFee = SECURITY_FEE_BASE * (1 + VAT_RATE); // ZAR 28,750

      let percentageRate = 0;
      if (supportType === 'full') {
        percentageRate = 0.03; // 3%
      } else if (supportType === 'admin') {
        percentageRate = 0.015; // 1.5%
      }
      supportFee = fundingValue * percentageRate;
      finalCost = supportFee + securityFee;
    }

    if (vatEnabled && pricingModel === 'hourly') { // Apply VAT only for hourly if enabled
      vatAmount = finalCost * 0.15; // 15% VAT
      finalCost += vatAmount;
    }

    setQuote({
      consultantProfile,
      businessName,
      clientName,
      projectName,
      service: selectedService,
      hourlyRate: pricingModel === 'hourly' ? hourlyRate : null,
      currency,
      complexity: pricingModel === 'hourly' ? complexity : null,
      numDocuments: pricingModel === 'hourly' && service && service.requiresDocCount ? numDocuments : null,
      finalHours: pricingModel === 'hourly' ? finalHours : null,
      finalCost,
      vatEnabled,
      vatAmount,
      tasks: pricingModel === 'hourly' && service ? service.tasks.map(t => ({ ...t, completed: completedTasks.includes(t.name) })) : null,
      pricingModel,
      fundingValue: pricingModel === 'percentage' ? fundingValue : null,
      supportType: pricingModel === 'percentage' ? supportType : null,
      securityFee: pricingModel === 'percentage' ? securityFee : null,
      supportFee: pricingModel === 'percentage' ? supportFee : null,
      supportDuration: pricingModel === 'percentage' ? '12 months, as-needed consultancy' : null,
      client: clients.find(c => c.name === clientName) || {},
    });
  };

  // Calculate completion progress
  const calculateProgress = () => {
    let progress = 0;
    if (consultantProfile.name && businessName) progress += 25;
    if (clientName && projectName) progress += 25;
    if (selectedService) progress += 25;
    if (quote) progress += 25;
    return progress;
  };
  
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-2 bg-gray-200 z-50">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link className="flex items-center text-blue-600 font-bold text-xl" to="/">
                  <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Consulting Estimator
                </Link>
              </div>
              <div className="flex space-x-1">
                <Link 
                  className="px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium" 
                  to="/"
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Estimator
                </Link>
                <Link 
                  className="px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium" 
                  to="/clients"
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  Clients
                </Link>
                <LanguageSelector />
              </div>
            </div>
          </div>
        </nav>
        
        {/* Dynamic Progress Indicator */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Quote Progress</h3>
              <span className="text-sm font-medium text-gray-600">{calculateProgress()}% Complete</span>
            </div>
            <div className="flex space-x-2">
              <div className={`flex-1 h-2 rounded-full ${
                consultantProfile.name && businessName ? 'bg-green-500' : 'bg-gray-200'
              }`}></div>
              <div className={`flex-1 h-2 rounded-full ${
                clientName && projectName ? 'bg-green-500' : 'bg-gray-200'
              }`}></div>
              <div className={`flex-1 h-2 rounded-full ${
                selectedService ? 'bg-green-500' : 'bg-gray-200'
              }`}></div>
              <div className={`flex-1 h-2 rounded-full ${
                quote ? 'bg-green-500' : 'bg-gray-200'
              }`}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Profile</span>
              <span>Project</span>
              <span>Service</span>
              <span>Quote</span>
            </div>
          </div>
        </div>

        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <UserDetails
                consultantProfile={consultantProfile}
                setConsultantProfile={setConsultantProfile}
                businessName={businessName}
                setBusinessName={setBusinessName}
                handleSaveDetails={handleSaveDetails}
              />
              <ProjectDetails
                clientName={clientName}
                setClientName={setClientName}
                projectName={projectName}
                setProjectName={setProjectName}
                clients={clients}
                onSelectExistingClient={(clientId) => {
                  const selectedClient = clients.find(client => client.id === clientId);
                  if (selectedClient) {
                    setClientName(selectedClient.name);
                    // Assuming projectName might be derived or left blank for new projects
                    // setProjectName(selectedClient.company); // Or some other default
                  }
                }}
              />
              <ServiceEstimator
                selectedService={selectedService}
                setSelectedService={(service) => {
                  setSelectedService(service);
                  setCompletedTasks([]); // Reset completed tasks when service changes
                }}
                hourlyRate={hourlyRate}
                setHourlyRate={(value) => setHourlyRate(parseFloat(value) || 0)}
                currency={currency}
                setCurrency={setCurrency}
                complexity={complexity}
                setComplexity={(value) => setComplexity(parseFloat(value) || 0)}
                numDocuments={numDocuments}
                setNumDocuments={(value) => setNumDocuments(parseInt(value, 10) || 0)}
                partialGroundwork={partialGroundwork}
                setPartialGroundwork={setPartialGroundwork}
                completedTasks={completedTasks}
                handleTaskToggle={handleTaskToggle}
                exchangeRates={exchangeRates}
                polishingPercentage={polishingPercentage}
                setPolishingPercentage={(value) => setPolishingPercentage(parseFloat(value) || 0)}
                vatEnabled={vatEnabled}
                setVatEnabled={setVatEnabled}
                pricingModel={pricingModel}
                setPricingModel={setPricingModel}
                fundingValue={fundingValue}
                setFundingValue={setFundingValue}
                supportType={supportType}
                setSupportType={setSupportType}
              />
              <div className="text-center mb-8">
                <button 
                  className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                  onClick={generateQuote}
                  disabled={!selectedService || !clientName.trim() || !projectName.trim()}
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Professional Quote
                </button>
                {(!selectedService || !clientName.trim() || !projectName.trim()) && (
                  <p className="mt-3 text-sm text-gray-600">
                    Please complete all required fields above to generate your quote
                  </p>
                )}
              </div>
              <Quote quote={quote} setQuote={setQuote} />
            </>
          } />
          <Route path="/clients" element={<ClientManagement />} />
        </Routes>
        
        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-gray-200 bg-white">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              © 2025 South African Business Consulting Platform | 
              <span className="text-green-600 font-medium">POPIA Compliant</span> | 
              <span className="text-blue-600 font-medium">VAT Ready</span>
            </p>
          </div>
        </footer>
          </div>
        </div>
        </Router>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;

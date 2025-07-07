
import React, { useState, useEffect } from 'react';
import { encrypt, decrypt } from './utils/encryption';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { services } from './servicesData';
import Header from './components/Header';
import UserDetails from './components/UserDetails';
import ProjectDetails from './components/ProjectDetails';
import ServiceEstimator from './components/ServiceEstimator';
import Quote from './components/Quote';
import ClientManagement from './components/ClientManagement';

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

  // State for the final quote
  const [quote, setQuote] = useState(null);

  // Load user details and clients from local storage on initial render
  useEffect(() => {
    const savedProfile = localStorage.getItem('consultantProfile');
    const savedBusinessName = localStorage.getItem('businessName');
    const savedClients = localStorage.getItem('clients');

    if (savedProfile) setConsultantProfile(JSON.parse(decrypt(savedProfile)));
    if (savedBusinessName) setBusinessName(decrypt(savedBusinessName));
    if (savedClients) setClients(JSON.parse(decrypt(savedClients)));
  }, []);

  // Save clients to local storage whenever the clients state changes
  useEffect(() => {
    localStorage.setItem('clients', encrypt(JSON.stringify(clients)));
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
    localStorage.setItem('consultantProfile', encrypt(JSON.stringify(consultantProfile)));
    localStorage.setItem('businessName', encrypt(businessName));
    alert('Your details have been saved!');
  };

  const handleTaskToggle = (taskName) => {
    setCompletedTasks(prev =>
      prev.includes(taskName) ? prev.filter(t => t !== taskName) : [...prev, taskName]
    );
  };

  const generateQuote = () => {
    if (!selectedService) {
      alert('Please select a service.');
      return;
    }

    const service = services[selectedService];
    let totalHours = 0;

    service.tasks.forEach(task => {
      let taskHours = task.hours;
      if (partialGroundwork && completedTasks.includes(task.name)) {
        // Apply polishing percentage for completed tasks
        taskHours *= (polishingPercentage / 100);
      }
      if (task.perDocument) {
        taskHours *= numDocuments;
      }
      totalHours += taskHours;
    });

    const finalHours = totalHours * complexity;
    let finalCost = finalHours * hourlyRate;
    let vatAmount = 0;
    if (vatEnabled) {
      vatAmount = finalCost * 0.15; // 15% VAT
      finalCost += vatAmount;
    }

    setQuote({
      consultantProfile,
      businessName,
      clientName,
      projectName,
      service: selectedService,
      hourlyRate,
      currency,
      complexity,
      numDocuments: service.requiresDocCount ? numDocuments : null,
      finalHours,
      finalCost,
      vatEnabled,
      vatAmount,
      tasks: service.tasks.map(t => ({ ...t, completed: completedTasks.includes(t.name) }))
    });
  };

  return (
    <Router>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg my-10">
        <nav className="bg-gray-100 p-4 rounded-lg shadow-md mb-6 flex justify-between items-center">
          <Link className="text-blue-600 font-bold text-xl" to="/">Consulting Estimator</Link>
          <div>
            <ul className="flex space-x-4">
              <li>
                <Link className="text-gray-700 hover:text-blue-600" to="/">Estimator</Link>
              </li>
              <li>
                <Link className="text-gray-700 hover:text-blue-600" to="/clients">Clients</Link>
              </li>
            </ul>
          </div>
        </nav>

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
                  const selectedClient = clients.find(client => client.id == clientId);
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
              />
              <div className="text-center">
                <button className="btn btn-primary btn-lg" onClick={generateQuote}>Generate Quote</button>
              </div>
              <Quote quote={quote} setQuote={setQuote} />
            </>
          } />
          <Route path="/clients" element={<ClientManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
